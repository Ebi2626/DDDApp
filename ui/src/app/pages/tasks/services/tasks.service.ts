import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { Observable, of } from 'rxjs';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { environment } from 'src/environments/environment';
import { mockTasks, Task } from '../models/tasks.models';

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
    // return of({ tasks: mockTasks });
  }

  createTask(task: Task) {
    return this.http.post(`${environment.api}/${Endpoints.TASK}`, task);
  }

  deleteTask(id: string) {
    return this.http.delete(`${environment.api}/${Endpoints.TASK}/${id}`)
  }

  updateTask(task: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${environment.api}/${Endpoints.TASK}/${task.id}`, task)
  }
}
