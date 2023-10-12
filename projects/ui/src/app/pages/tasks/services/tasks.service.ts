import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map, tap, throwError } from 'rxjs';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { environment } from 'src/environments/environment';
import {
  CyclicTask,
  CyclicTaskItemRealization,
  MONTH_DURATION,
  ProgressiveTask,
  ProgressiveTaskItemRealization,
  Task,
  TaskFile,
  TaskRealizationConfirmation,
  TaskType,
  WEEK_DURATION,
  YEAR_DURATION,
} from 'dddapp-common';
import { NewTaskForRequest } from '../models/task.model';
import { UpdateStr } from '@ngrx/entity/src/models';
import { Page } from 'src/app/core/reducers/query.reducer';
import { DateTime } from 'luxon';

export interface FirstLastPeriod {
  firstPeriod: number; lastPeriod: number
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  fetchTasks(
    categories: string[] = [],
    page: Page
  ): Observable<{ tasks: Task[]; page: Page }> {
    let httpOptions;
    const tasksUrl = `${environment.api}/${Endpoints.TASKS}`;
    let params = new HttpParams();
    params = params.append('page', `${page.current}`);
    params = params.append('size', `${page.size}`);
    if (categories?.length) {
      const categoriesString = categories.join(',');
      params = params.append('categories', categoriesString);
      httpOptions = {
        params,
      };
      return this.http.get<{ tasks: Task[]; page: Page }>(
        tasksUrl,
        httpOptions
      );
    }
    httpOptions = {
      params,
    };
    return this.http.get<{ tasks: Task[]; page: Page }>(tasksUrl, httpOptions);
  }

  createTask(task: NewTaskForRequest): Observable<Task> {
    return this.http.post<Task>(`${environment.api}/${Endpoints.TASKS}`, task);
  }

  deleteTask(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(
      `${environment.api}/${Endpoints.TASKS}/${id}`
    );
  }

  updateTask(task: Partial<Task>, taskId: string): Observable<UpdateStr<Task>> {
    return this.http
      .patch<{ task: Partial<Task> }>(
        `${environment.api}/${Endpoints.TASKS}/${taskId}`,
        task
      )
      .pipe(
        map(({ task }) => {
          const updatedTask: UpdateStr<Task> = {
            changes: { ...task },
            id: taskId,
          };
          return updatedTask;
        })
      );
  }

  async uploadFile(
    file: File,
    taskId: string,
    index?: number
  ): Promise<TaskFile> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);
    index ? formData.append('taskCompletionIndex', `${index}`) : null;

    const response$ = this.http
      .post(`${environment.api}/${Endpoints.FILES}/${taskId}`, formData)
      .pipe(
        tap((response: any) => {
          console.log('response from upload: ', response);
        })
      );
    return await lastValueFrom(response$);
  }

  async removeFile(
    file: string,
    taskId: string,
    index?: number
  ): Promise<TaskFile> {
    const response$ = this.http
      .delete(`${environment.api}/${Endpoints.FILES}/${taskId}`, {
        params: {
          fileName: file,
          ...(index != undefined ? { taskCompletionIndex: index } : null),
        },
      })
      .pipe(
        tap((response: any) => {
          console.log('response from upload: ', response);
        })
      );
    return await lastValueFrom(response$);
  }

  static getDefaultValueForTaskType(
    verification_method: TaskRealizationConfirmation
  ) {
    switch (+verification_method) {
      case TaskRealizationConfirmation.TEXT:
        return '';
      case TaskRealizationConfirmation.NUMBER:
        return null;
      case TaskRealizationConfirmation.CHECKBOX:
        return false;
      case TaskRealizationConfirmation.FILE:
        return '';
      default:
        throw new Error('Wrong verification method');
    }
  }
  private static getTaskNumberFirstAndLastPeriod(
    periodInMillis: number,
    tasksPerIteration: number,
    taskCreationTime: Date,
    taskEndTime: Date
  ): FirstLastPeriod {
    const startDate = DateTime.fromJSDate(taskCreationTime);
    const endDate = DateTime.fromJSDate(taskEndTime);
    const timePerOneTask = Math.floor(periodInMillis / tasksPerIteration);
    const periodString = TasksService.getPeriodString(periodInMillis);
    const endOfFirstPeriod = startDate.endOf(periodString);
    const beginningDiff = endOfFirstPeriod.toMillis() - startDate.toMillis();
    const firstPeriod = Math.ceil(beginningDiff / timePerOneTask);
    const beginningOfLastPeriod = endDate.startOf(periodString);
    const endingDiff = endDate.toMillis() - beginningOfLastPeriod.toMillis();
    const lastPeriod = Math.ceil(endingDiff / timePerOneTask);
    return { firstPeriod, lastPeriod };
  }

  private static getPeriodString(periodInMillis: number): 'week' | 'month' | 'year' {
    switch(periodInMillis){
      case WEEK_DURATION:
        return 'week';
      case MONTH_DURATION:
        return 'month';
      case YEAR_DURATION:
        return 'year';
      default:
        throw new Error('wrong period');
    }
  }

  public static createTaskCompletionsArray(
    task: CyclicTask | ProgressiveTask
  ): CyclicTaskItemRealization[] | ProgressiveTaskItemRealization[] {
    const iterationDuration: number = task.iterationDuration; //ms
    const startDate = task.creationDate.getTime(); //ms
    const endDate = task.deadline.getTime(); //ms
    const diff = endDate - startDate;
    const { firstPeriod, lastPeriod }: FirstLastPeriod = TasksService.getTaskNumberFirstAndLastPeriod(+task.iterationDuration, task.tasksPerIteration, task.creationDate, task.deadline);
    const tasksPerIteration = task.tasksPerIteration;
    const numberOfIterations = Math.ceil(diff / iterationDuration);
    const cyclicResultArray: CyclicTaskItemRealization[] = [];
    const progressiveResultArray: ProgressiveTaskItemRealization[] = [];
    const periodString = TasksService.getPeriodString(+task.iterationDuration);

    if (task.type == TaskType.CYCLIC) {

      for (let i = 0; i < numberOfIterations; i++) {
        const dueDate = DateTime.fromMillis(startDate).plus({ [periodString]: i}).endOf(periodString).toJSDate();

        if(i === 0) {
          for (let j = 0; j < firstPeriod; j++) {
            const cyclicTaskItemRealizaton: CyclicTaskItemRealization = {
              value: this.getDefaultValueForTaskType(task.verification_method),
              dueDate,
            };
            cyclicResultArray.push(cyclicTaskItemRealizaton);
          }

        } else if(i === numberOfIterations - 1 && i !== 0) {
          for (let j = 0; j < lastPeriod; j++) {
            const cyclicTaskItemRealizaton: CyclicTaskItemRealization = {
              value: this.getDefaultValueForTaskType(task.verification_method),
              dueDate,
            };
            cyclicResultArray.push(cyclicTaskItemRealizaton);
          }

        } else {
          for (let j = 0; j < tasksPerIteration; j++) {
            const cyclicTaskItemRealizaton: CyclicTaskItemRealization = {
              value: this.getDefaultValueForTaskType(task.verification_method),
              dueDate,
            };
            cyclicResultArray.push(cyclicTaskItemRealizaton);
          }
        }
      }

      return cyclicResultArray;
    }

    if (task.type == TaskType.PROGRESSIVE) {
      for (let i = 0; i < numberOfIterations; i++) {
        const dueDate = DateTime.fromMillis(startDate).plus({ [periodString]: i}).endOf(periodString).toJSDate();
        const goal = task.initialTaskValue + task.progressStep * (i + 1);

        if(i === 0) {
          for (let j = 0; j < firstPeriod; j++) {
            const progressiveTaskItemRealizaton: ProgressiveTaskItemRealization =
            {
              dueDate,
              goal,
              value: null,
            };
            progressiveResultArray.push(progressiveTaskItemRealizaton);
          }

        } else if(i === numberOfIterations - 1 && i !== 0) {
          for (let j = 0; j < lastPeriod; j++) {
            const progressiveTaskItemRealizaton: ProgressiveTaskItemRealization =
            {
              dueDate,
              goal,
              value: null,
            };
            progressiveResultArray.push(progressiveTaskItemRealizaton);
          }

        } else {
          for (let j = 0; j < tasksPerIteration; j++) {
            const progressiveTaskItemRealizaton: ProgressiveTaskItemRealization =
            {
              dueDate,
              goal,
              value: null,
            };
            progressiveResultArray.push(progressiveTaskItemRealizaton);
          }
        }
      }

      return progressiveResultArray;
    }

    throwError(() => new Error('Wrong task type'));
    return [];
  }
}
