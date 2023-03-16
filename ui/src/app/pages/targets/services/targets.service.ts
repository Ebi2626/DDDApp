import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { Target } from '../models/targets.model';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TargetsService {

  constructor(
    private http: HttpClient
  ) { }

  fetchTargets(): Observable<{ targets: Target[] }> {
    return this.http.get<{ targets: Target[] }>(`${environment.api}/${Endpoints.TARGETS}`);
  }

  createTarget(target: Target) {
    return this.http.post(`${environment.api}/${Endpoints.TARGET}`, target);
  }

  deleteTarget(id: string) {
    return this.http.delete(`${environment.api}/${Endpoints.TARGET}/${id}`)
  }

  updateTarget(target: Update<Target>) {
    return this.http.put(`${environment.api}/${Endpoints.TARGET}/${target.id}`, target)
  }
}
