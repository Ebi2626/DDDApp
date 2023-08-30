import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as SettingsActions from '../actions/settings.actions';
import { catchError, map, of, switchMap } from 'rxjs';
import { DataService } from '../services/data.service';

@Injectable()
export class SettingsEffects {
  importData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.importData),
      switchMap(({ importedData }) =>
        this.dataService
          .import(importedData)
          .pipe(
            map((updatedData) =>
              SettingsActions.importDataSuccessfull({
                importedData: updatedData,
              })
            )
          )
      )
    )
  );

  fetchAppData$ = createEffect(
    () => this.actions$.pipe(
      ofType(SettingsActions.fetchAppData),
      switchMap(() => this.dataService.appData().pipe(
        map((appData) => SettingsActions.fetchAppDataSuccessfull({appData}))
      )),
      catchError(() => of(SettingsActions.fetchAppDataFailed())
      )
    )
  )

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private dataService: DataService
  ) {}
}
