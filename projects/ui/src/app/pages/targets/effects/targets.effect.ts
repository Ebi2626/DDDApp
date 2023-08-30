import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TargetsService } from '../services/targets.service';
import * as TargetsActions from '../actions/targets.actions';
import * as QuerySelectors from 'src/app/core/selectors/query.selectors';
import * as QueryActions from 'src/app/core/actions/query.actions';
import * as SettingsActions from 'src/app/pages/settings/actions/settings.actions';
import {
  catchError,
  concatMap,
  debounceTime,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';

@Injectable()
export class TargetsEffects {
  fetchTargets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        TargetsActions.fetchTargets,
        QueryActions.updateCategories,
        TargetsActions.changePage
      ),
      withLatestFrom(
        this.store.select(QuerySelectors.selectCategories),
        this.store.select(QuerySelectors.selectPage)
      ),
      debounceTime(200),
      switchMap(([_, categories, page]) => {
        let newPage;
        switch (_.type) {
          case TargetsActions.changePage.type:
            newPage = {
              ...page,
              current: _.number,
            };
            break;
          case QueryActions.updateCategories.type:
            newPage = {
              ...page,
              current: 0,
            };
            break;
          default:
            newPage = page;
            break;
        }
        return this.targetsService.fetchTargets(categories, newPage).pipe(
          tap(({targets}) => {
            console.log('We are dispatching setTargets in fetchTargets with: ', {targets});
          }),
          concatMap(({ targets, page }) =>
            of(
              TargetsActions.setTargets({ targets }),
              TargetsActions.setNewPage({ page })
            )
          ),
          catchError(() =>
            of(
              TargetsActions.fetchTargetsFailed(),
              TargetsActions.changePageFailed()
            )
          )
        );
      })
    )
  );

  deleteTarget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TargetsActions.deleteTargetRequest),
      switchMap(({ id }) =>
        this.targetsService.deleteTarget(id).pipe(
          map(({ id }) => TargetsActions.deleteTarget({ id })),
          catchError(() => of(TargetsActions.deleteTargetFailed()))
        )
      )
    )
  );

  updateTarget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TargetsActions.updateTargetRequest),
      switchMap(({ target }) =>
        this.targetsService.updateTarget(target).pipe(
          map(({ target }) =>
            TargetsActions.updateTarget({
              target: {
                changes: target,
                id: target.id,
              },
            })
          ),
          catchError(() => of(TargetsActions.updateTargetFailed()))
        )
      )
    )
  );

  createTarget$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TargetsActions.createTargetRequest),
      switchMap(({ target }) =>
        this.targetsService.createTarget(target).pipe(
          map(({ target }) =>
            TargetsActions.createTarget({
              target,
            })
          ),
          catchError(() => of(TargetsActions.createTargetFailed()))
        )
      )
    )
  );

  replaceAllTargets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.importDataSuccessfull),
      switchMap(({ importedData: { Targets } }) => {
        this.store.dispatch(TargetsActions.clearAllTargets());
        console.log('We are dispatching setTargets in replaceAll with: ', {targets: Targets});
        return of(TargetsActions.setTargets({ targets: Targets }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private targetsService: TargetsService
  ) {}
}
