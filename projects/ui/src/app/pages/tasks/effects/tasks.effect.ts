import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TasksService } from '../services/tasks.service';
import * as TasksActions from '../actions/tasks.actions';
import * as TaskSelectors from '../selectors/tasks.selectors';
import * as QueryActions from "src/app/core/actions/query.actions";
import * as QuerySelectors from "src/app/core/selectors/query.selectors";
import * as SettingsActions from 'src/app/pages/settings/actions/settings.actions';
import { catchError, concatMap, debounceTime, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { CyclicTask, CyclicTaskItemRealization } from 'dddapp-common';

@Injectable()
export class TasksEffects {
  fetchTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.fetchTasks, QueryActions.updateCategories, TasksActions.changePage),
      withLatestFrom(
        this.store.select(QuerySelectors.selectCategories),
        this.store.select(TaskSelectors.selectTaskPage)
        ),
      debounceTime(200),
      switchMap(([_, categories, page]) => {
        let newPage;
        switch(_.type) {
          case TasksActions.changePage.type:
            newPage = {
              ...page,
              current: _.number
            }
          break;
          case QueryActions.updateCategories.type:
            newPage = {
              ...page,
              current: 0
            }
          break;
          default:
            newPage = page
          break;
        }
        return this.tasksService.fetchTasks(categories, newPage).pipe(
          concatMap(({tasks, page}) => of(
              TasksActions.setTasks({ tasks }),
              TasksActions.setNewPage({ page }),
            )),
          catchError(() => of(
            TasksActions.fetchTasksFailed(),
            TasksActions.changePageFailed(),
            ))
        );
      })
    )
  );

  sendSingleFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.sendFileAndUpdateSingleTaskRequest),
      switchMap(async ({ task, file }) => {
        const uploadResponse = await this.tasksService.uploadFile(
          file,
          task.id as string
        );
        if (uploadResponse) {
          const upadtedTask = {
            ...task,
            value: uploadResponse,
          };
          return TasksActions.updateTaskRequest({ task: upadtedTask });
        }
        throw new Error('Błąd przesyłania pliku');
      }),
      catchError((e) => [TasksActions.updateTaskFailed()])
    )
  );

  sendCyclicFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.sendFileAndUpdateCyclicTaskRequest),
      switchMap(async ({ task, file, completionItemIndex }) => {
        const uploadResponse = await this.tasksService.uploadFile(
          file,
          task.id as string,
          completionItemIndex
        );
        if (uploadResponse) {
          const updatedTask: Partial<CyclicTask> = {
            ...task,
            taskCompletions:
              (task?.taskCompletions as CyclicTaskItemRealization[])?.map((taskCompletion, index) => {
                return {
                  dueDate: taskCompletion.dueDate,
                  value:
                    index === completionItemIndex
                      ? uploadResponse
                      : taskCompletion.value,
                };
              }) || [],
          };
          return TasksActions.updateTaskRequest({ task: updatedTask });
        }
        throw new Error('Błąd przesyłania pliku');
      }),
      catchError((e) => [TasksActions.updateTaskFailed()])
    )
  );

  removeSingleFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.removeFileAndUpdateSingleTaskRequest),
      switchMap(async ({ task, fileName }) => {
        const uploadResponse = await this.tasksService.removeFile(
          fileName,
          task.id as string
        );
        if (uploadResponse) {
          return TasksActions.updateTaskRequest({ task });
        }
        throw new Error('Błąd usuwania pliku');
      }),
      catchError((e) => [TasksActions.updateTaskFailed()])
    )
  );

  removeCyclicFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.removeFileAndUpdateCyclicTaskRequest),
      switchMap(async ({ task, fileName, completionItemIndex }) => {
        const uploadResponse = await this.tasksService.removeFile(
          fileName,
          task.id as string,
          completionItemIndex
        );
        if (uploadResponse) {
          const updatedTask: Partial<CyclicTask> = {
            ...task,
            taskCompletions:
              (task?.taskCompletions as CyclicTaskItemRealization[])?.map((taskCompletion, index) => {
                return {
                  dueDate: taskCompletion.dueDate,
                  value:
                    index === completionItemIndex ? '' : taskCompletion.value,
                };
              }) || [],
          };
          return TasksActions.updateTaskRequest({ task: updatedTask });
        }
        throw new Error('Błąd usuwania pliku');
      }),
      catchError((e) => [TasksActions.updateTaskFailed()])
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTaskRequest),
      switchMap(({ task }) =>
        this.tasksService.updateTask(task, task.id as string).pipe(
          switchMap((task) => [TasksActions.updateTask(task)]),
          catchError((e) => [TasksActions.updateTaskFailed()])
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTaskRequest),
      switchMap(({ id }) =>
        this.tasksService.deleteTask(id).pipe(
          switchMap(({ id }) => [TasksActions.deleteTask({ id })]),
          catchError((e) => [TasksActions.deleteTaskFailed()])
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTaskRequest),
      switchMap(({ task }) =>
        this.tasksService.createTask(task).pipe(
          switchMap((task) => [TasksActions.createTask({ task })]),
          catchError((e) => [TasksActions.createTaskFailed()])
        )
      )
    )
  );


  replaceAllTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.importDataSuccessfull),
      switchMap(({ importedData: { Tasks } }) => {
        this.store.dispatch(TasksActions.clearAllTasks());
        return of(TasksActions.setTasks({ tasks: Tasks }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private tasksService: TasksService,
    private store: Store<AppState>
  ) {}
}
