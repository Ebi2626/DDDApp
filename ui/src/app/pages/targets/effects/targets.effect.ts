import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TargetsService } from "../services/targets.service";
import * as TargetsActions from "../actions/targets.actions";
import * as TargetsSelectors from "../selectors/targets.selectors";
import { catchError, map, of, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.state";



@Injectable()
export class TargetsEffects {
  fetchTargets$ = createEffect(
    () => this.actions$.pipe(
      ofType(TargetsActions.fetchTargets),
      withLatestFrom(
        this.store.select(TargetsSelectors.selectTargets)
      ),
      switchMap(([_, targets]) => {
        if (targets.length) {
          return of(targets).pipe(
            map((targets) => TargetsActions.setTargets({ targets }))
          )
        }
        return this.targetsService.fetchTargets().pipe(
          map(({ targets }) => TargetsActions.setTargets({ targets })),
          catchError(() => of(TargetsActions.fetchTargetsFailed()))
        )
      }),
    ));

  deleteTarget$ = createEffect(
    () => this.actions$.pipe(
      ofType(TargetsActions.deleteTargetRequest),
      switchMap(({ id }) => this.targetsService.deleteTarget(id).pipe(
        map(({ id }) => TargetsActions.deleteTarget({ id })),
        catchError(() => of(TargetsActions.deleteTargetFailed()))
      ))
    ));

  updateTarget$ = createEffect(
    () => this.actions$.pipe(
      ofType(TargetsActions.updateTargetRequest),
      switchMap(({ target }) => this.targetsService.updateTarget(target).pipe(
        map(({ target }) => TargetsActions.updateTarget({
          target: {
            changes: target,
            id: target._key
          }
        })),
        catchError(() => of(TargetsActions.updateTargetFailed()))
      ))
    ))

  createTarget$ = createEffect(
    () => this.actions$.pipe(
      ofType(TargetsActions.createTargetRequest),
      switchMap(({ target }) => this.targetsService.createTarget(target).pipe(
        map(({ target }) => TargetsActions.createTarget({
          target
        })),
        catchError(() => of(TargetsActions.createTargetFailed()))
      ))
    ))

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private targetsService: TargetsService,
  ) { }
}