import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TargetsService } from "../services/targets.service";
import * as TargetsActions from "../actions/targets.actions";
import { catchError, map, switchMap } from "rxjs";
import { Target } from "../models/targets.model";
import { Action } from "@ngrx/store";



@Injectable()
export class TargetsEffects {
  fetchTargets$ = createEffect(
    () => this.actions$.pipe(
      ofType(TargetsActions.fetchTargets),
      switchMap(() => this.targetsService.fetchTargets().pipe(
        map(({ targets }) => TargetsActions.setTargets({ targets })),
      )),
    ));

  constructor(
    private actions$: Actions,
    private targetsService: TargetsService,
  ) { }
}