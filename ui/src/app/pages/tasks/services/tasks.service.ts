import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { Observable, of, throwError } from 'rxjs';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { environment } from 'src/environments/environment';
import { CyclicTask, CyclicTaskItemRealization, mockTasks, ProgressiveTask, ProgressivTaskItemRealization, Task, TaskType } from '../models/tasks.models';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private http: HttpClient
  ) { }

  fetchTasks(taskIds?: string[]): Observable<{ tasks: Task[] }> {
    return this.http.get<{ tasks: Task[] }>(`${environment.api}/${Endpoints.TASKS}`, taskIds?.length ? {
      params: {
        id: taskIds.join(',')
      }
    } : {});
  }

  createTask(task: Task): Observable<{ task: Task }> {
    return this.http.post<{ task: Task }>(`${environment.api}/${Endpoints.TASKS}`, task);
  }

  deleteTask(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${environment.api}/${Endpoints.TASKS}/${id}`)
  }

  updateTask(task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${environment.api}/${Endpoints.TASKS}/${task.id}`, task)
  }

  public static createTaskCompletionsArray(task: CyclicTask | ProgressiveTask): CyclicTaskItemRealization[] | ProgressivTaskItemRealization[] {
    const iterationDuration: number = task.iterationDuration; //ms
    const startDate = task.creationDate.getTime(); //ms
    const endDate = task.deadline.getTime(); //ms
    const diff = endDate - startDate;
    const tasksPerIteration = task.tasksPerIteration;
    const numberOfIterations = Math.floor(diff / iterationDuration);
    const cyclicResultArray: CyclicTaskItemRealization[] = [];
    const progressiveResultArray: ProgressivTaskItemRealization[] = [];

    if (task.type == TaskType.CYCLIC) {

      for (let i = 1; i <= numberOfIterations; i++) {

        const dueDate = new Date(startDate + iterationDuration * i);

        for (let j = 0; j < tasksPerIteration; j++) {
          const cyclicTaskItemRealizaton: CyclicTaskItemRealization = {
            completed: false,
            dueDate
          }
          cyclicResultArray.push(cyclicTaskItemRealizaton);
        }

      }
      console.log('Cyclic resultArray: ', cyclicResultArray);
      return cyclicResultArray;
    }

    if (task.type == TaskType.PROGRESSIVE) {

      for (let i = 0; i < numberOfIterations; i++) {

        const dueDate = new Date(startDate + iterationDuration * (i + 1));
        const value = task.initialTaskValue + task.progressStep * i;

        for (let j = 0; j < tasksPerIteration; j++) {
          const progressiveTaskItemRealizaton: ProgressivTaskItemRealization = {
            completed: false,
            dueDate,
            value
          }
          progressiveResultArray.push(progressiveTaskItemRealizaton);
        }

      }
      console.log('Progressive resultArray: ', progressiveResultArray);

      return progressiveResultArray;
    }

    throwError(() => new Error('Wrong task type'));
    return [];
  }
}
