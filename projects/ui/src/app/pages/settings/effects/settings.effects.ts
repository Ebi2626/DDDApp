import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as SettingsActions from '../actions/settings.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { DataService } from '../services/data.service';

@Injectable()
export class SettingsEffects {
  importData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.importData),
      switchMap(({ importedData }) =>
        this.dataService.import(importedData).pipe(
          map((updatedData) =>
            SettingsActions.importDataSuccessfull({
              importedData: updatedData,
            })
          )
        )
      )
    )
  );

  fetchUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.fetchUserData),
      switchMap(() =>
        this.dataService
          .appData()
          .pipe(
            map((userData) =>
              SettingsActions.fetchUserDataSuccessfull({ userData })
            )
          )
      ),
      catchError(() => of(SettingsActions.fetchUserDataFailed()))
    )
  );

  fetchUserSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.fetchUserSettings),
      switchMap(() =>
        this.dataService.getUserSettings().pipe(
          map((settings) => {
            const { colors } = settings;
            colors.forEach(({ colorId, color }) => {
              document.documentElement.style.setProperty(`--${colorId}`, color);
            });
            return SettingsActions.fetchUserSettingsSuccessfull({ settings });
          })
        )
      ),
      catchError(() => of(SettingsActions.fetchUserSettingsFailed()))
    )
  );

  updateUserSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateUserSettings),
      switchMap(({ settings }) =>
        this.dataService.updateUserSettings(settings).pipe(
          map(({ settings }) => {
            const { colors } = settings;
            colors.forEach(({ colorId, color }) => {
              document.documentElement.style.setProperty(`--${colorId}`, color);
            });
            return SettingsActions.updateUserSettingsSuccessfull({ settings });
          })
        )
      ),
      catchError(() => of(SettingsActions.updateUserSettingsFailed()))
    )
  );

  constructor(private actions$: Actions, private dataService: DataService) {}
}
