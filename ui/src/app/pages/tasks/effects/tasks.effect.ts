import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TasksService } from "../services/tasks.service";
import * as TasksActions from "../actions/tasks.actions";
import * as TargetsActions from "../../targets/actions/targets.actions";
import { catchError, map, mergeMap, of, switchMap } from "rxjs";
import { Task } from "../models/tasks.models";
import { Action, Store } from "@ngrx/store";
import { AppState } from "src/app/app.state";



@Injectable()
export class TasksEffects {
  fetchTasks$ = createEffect(
    () => this.actions$.pipe(
      ofType(TasksActions.fetchTasks),
      switchMap(() => this.tasksService.fetchTasks().pipe(
        mergeMap(({ tasks }) => [
          TasksActions.setTasks({ tasks }),
        ]),
        catchError(() => of(
          TasksActions.fetchTasksFailed(),
        )
        )),
      )))

  updateTask$ = createEffect(
    () => this.actions$.pipe(
      ofType(TasksActions.updateTaskRequest),
      switchMap(
        ({ task }) => this.tasksService.updateTask(task).pipe(
          switchMap((updatedTask) => [TasksActions.updateTask({
            updatedTask: {
              changes: updatedTask,
              id: updatedTask.id
            },
          })]),
          catchError((e) => [
            TasksActions.updateTaskFailed(),
          ]
          )
        )),
    )
  );

  constructor(
    private actions$: Actions,
    private tasksService: TasksService,
    private store: Store<AppState>,
  ) { }
}