import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TargetsService } from "../services/targets.service";
import * as TargetsActions from "../actions/targets.actions";
import * as TasksActions from "../../tasks/actions/tasks.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { Target } from "../models/targets.model";
import { Action } from "@ngrx/store";



@Injectable()
export class TargetsEffects {
  fetchTargets$ = createEffect(
    () => this.actions$.pipe(
      ofType(TargetsActions.fetchTargets),
      switchMap(() => this.targetsService.fetchTargets().pipe(
        map(({ targets }) => TargetsActions.setTargets({ targets })),
        catchError(() => of(TargetsActions.fetchTargetsFailed()))
      )),
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
            id: target.id
          }
        })),
        catchError(() => of(TargetsActions.updateTargetFailed()))
      ))
    ))

  constructor(
    private actions$: Actions,
    private targetsService: TargetsService,
  ) { }
}