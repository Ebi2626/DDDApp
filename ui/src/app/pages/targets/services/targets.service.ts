import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { Target, TargetStateClass } from '../models/targets.model';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { Task } from '../../tasks/models/tasks.models';
import { TargetProgressService } from './targetProgress.service';

@Injectable({
  providedIn: 'root'
})
export class TargetsService {

  constructor(
    private http: HttpClient,
    private targetProgressService: TargetProgressService,
  ) { }

  fetchTargets(): Observable<{ targets: Target[] }> {
    return this.http.get<{ targets: Target[] }>(`${environment.api}/${Endpoints.TARGETS}`);
  }

  createTarget(target: Target): Observable<{ target: Target }> {
    return this.http.post<{ target: Target }>(`${environment.api}/${Endpoints.TARGETS}`, target);
  }

  deleteTarget(id: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${environment.api}/${Endpoints.TARGETS}/${id}`)
  }

  updateTarget(target: Target) {
    return this.http.patch<{ target: Target }>(`${environment.api}/${Endpoints.TARGETS}/${target.id}`, target)
  }

  public static getTargetTasks(target?: Target, tasks?: Task[] | null) {
    return target && tasks?.length ? tasks.filter((task) => target?.tasks.includes(task.id)) : [];
  }

  public validateTarget(target: Target, tasks: Task[] | null): TargetStateClass {
    if (!tasks?.length) {
      return TargetStateClass.IN_PROGRESS
    }
    const currentTasks = TargetsService.getTargetTasks(target, tasks)
    const now = Date.now();
    const targetRealizationDate = (new Date(target.deadline)).valueOf();
    const progress = this.targetProgressService.getTargetProgress(target, currentTasks);
    const result =
      targetRealizationDate - now <= 0
        ? (progress === 1 ? TargetStateClass.SUCCESS : TargetStateClass.FAILED)
        : TargetStateClass.IN_PROGRESS
    return result;
  }
}
