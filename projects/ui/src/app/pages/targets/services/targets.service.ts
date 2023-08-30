import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { Observable } from 'rxjs';
import { Task, Target, TargetStateClass  } from 'dddapp-common';
import { TargetProgressService } from './targetProgress.service';
import { Page } from 'src/app/core/reducers/query.reducer';

@Injectable({
  providedIn: 'root'
})
export class TargetsService {

  constructor(
    private http: HttpClient,
    private targetProgressService: TargetProgressService,
  ) { }

  fetchTargets(categories: string[] = [], page: Page): Observable<{ targets: Target[], page: Page }> {
    const targetsUrl = `${environment.api}/${Endpoints.TARGETS}`;
    let httpOptions;
    let params = new HttpParams();
    params = params
      .append('page', `${page.current}`)
      .append('size', `${page.size}`);
    if(categories && categories.length) {
      const categoriesString = categories.join(',');
      params = params.append('categories', categoriesString);
      httpOptions = {
        params,
      };
      return this.http.get<{ targets: Target[], page: Page }>(targetsUrl, httpOptions);
    }
    httpOptions = {
      params,
    };
    return this.http.get<{ targets: Target[], page: Page }>(targetsUrl, httpOptions);
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
    return target && tasks?.length ? tasks.filter((task) => target?.tasks?.includes(task.id)) : [];
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
