import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, lastValueFrom, map, tap, throwError } from 'rxjs';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { environment } from 'src/environments/environment';
import {
  CyclicTask,
  CyclicTaskItemRealization,
  ProgressiveTask,
  ProgressiveTaskItemRealization,
  Task,
  TaskFile,
  TaskRealizationConfirmation,
  TaskType,
} from 'dddapp-common';
import { NewTaskForRequest } from '../models/task.model';
import { Update } from '@ngrx/entity';
import { UpdateStr } from '@ngrx/entity/src/models';

type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(private http: HttpClient) {}

  fetchTasks(taskIds?: string[]): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${environment.api}/${Endpoints.TASKS}`,
      taskIds?.length
        ? {
            params: {
              id: taskIds.join(','),
            },
          }
        : {}
    );
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
    return this.http.patch<{ task: Partial<Task>}>(
      `${environment.api}/${Endpoints.TASKS}/${taskId}`,
      task
    ).pipe(
      map(({task}) => {
        console.log('task in updateTask: ', task);
        const updatedTask: UpdateStr<Task> = {
          changes: {...task},
          id: taskId
        }
        console.log('task po sparsowaniu: ', updatedTask);
        return updatedTask
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

  public static createTaskCompletionsArray(
    task: CyclicTask | ProgressiveTask
  ): CyclicTaskItemRealization[] | ProgressiveTaskItemRealization[] {
    const iterationDuration: number = task.iterationDuration; //ms
    const startDate = task.creationDate.getTime(); //ms
    const endDate = task.deadline.getTime(); //ms
    const diff = endDate - startDate;
    const tasksPerIteration = task.tasksPerIteration;
    const numberOfIterations = Math.floor(diff / iterationDuration);
    const cyclicResultArray: CyclicTaskItemRealization[] = [];
    const progressiveResultArray: ProgressiveTaskItemRealization[] = [];

    if (task.type == TaskType.CYCLIC) {
      for (let i = 0; i < numberOfIterations; i++) {
        const dueDate = new Date(startDate + iterationDuration * i);

        for (let j = 0; j < tasksPerIteration; j++) {
          const cyclicTaskItemRealizaton: CyclicTaskItemRealization = {
            value: this.getDefaultValueForTaskType(task.verification_method),
            dueDate,
          };
          cyclicResultArray.push(cyclicTaskItemRealizaton);
        }
      }
      return cyclicResultArray;
    }

    if (task.type == TaskType.PROGRESSIVE) {
      for (let i = 0; i < numberOfIterations; i++) {
        const dueDate = new Date(startDate + iterationDuration * (i + 1));
        const goal = task.initialTaskValue + task.progressStep * i;

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

      return progressiveResultArray;
    }

    throwError(() => new Error('Wrong task type'));
    return [];
  }
}
