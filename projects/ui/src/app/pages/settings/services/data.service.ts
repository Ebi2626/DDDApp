import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Endpoints } from 'src/app/shared/models/endpoints.model';
import { Target, Category, Task, Settings } from 'dddapp-common';
import { Observable } from 'rxjs';
import * as R from 'ramda';
import { UserData } from '../components/app-data/app-data.component';

export interface CreateDataDto {
  Targets: Target[];
  Categories: Category[];
  Tasks: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  export() {
    const exportUrl = `${environment.api}/${Endpoints.DATA}/export`;
    return this.http.get(exportUrl).pipe();
  }

  import(importedData: CreateDataDto): Observable<CreateDataDto> {
    const importUrl = `${environment.api}/${Endpoints.DATA}/import`;
    const dataWithoutKeys = R.replace(
      '_key',
      'id',
      JSON.stringify(importedData)
    );
    return this.http.post<CreateDataDto>(
      importUrl,
      JSON.parse(dataWithoutKeys)
    );
  }

  appData() {
    const appDataUrl = `${environment.api}/${Endpoints.SETTINGS}/appData`;
    return this.http.get<UserData>(appDataUrl);
  }

  getUserSettings() {
    const userSettingsUrl = `${environment.api}/${Endpoints.SETTINGS}/userSettings`;
    return this.http.get<Settings>(userSettingsUrl);
  }

  updateUserSettings(
    newSettings: Settings
  ): Observable<{ settings: Settings }> {
    const userUpdateSettingsUrl = `${environment.api}/${Endpoints.SETTINGS}/userSettings`;
    return this.http.patch<{ settings: Settings }>(userUpdateSettingsUrl, {
      settings: newSettings,
    });
  }
}
