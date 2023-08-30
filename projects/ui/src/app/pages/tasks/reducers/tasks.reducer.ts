import { EntityAdapter, Update } from '@ngrx/entity';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as TasksActions from '../actions/tasks.actions';
import { Task } from 'dddapp-common';
import { Page, initialPage } from 'src/app/core/reducers/query.reducer';

export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export interface State extends EntityState<Task> {
  isFetching: boolean;
  hasError: boolean;
  page: Page;
}

export const initialState: State = adapter.getInitialState({
  hasError: false,
  isFetching: false,
  page: initialPage,
});

export const tasksReducer = createReducer(
  initialState,
  on(TasksActions.fetchTasks, (state) => ({
    ...state,
    isFetching: true,
    hasError: false,
  })),
  on(TasksActions.setTasks, (state, { tasks }) => ({
    ...adapter.setAll(tasks, state),
    isFetching: false,
  })),
  on(TasksActions.fetchTasksFailed, (state) => ({
    ...state,
    isFetching: false,
    hasError: true,
  })),
  on(TasksActions.changePage, (state) => ({
    ...state,
    isFetching: true,
    hasError: false,
  })),
  on(TasksActions.setNewPage, (state, { page }) => ({
    ...state,
    page,
    isFetching: false,
    hasError: false,
  })),
  on(TasksActions.changePageFailed, (state) => ({
    ...state,
    isFetching: false,
    hasError: true,
  })),
  on(TasksActions.createTaskRequest, (state) => ({
    ...state,
    isFetching: true,
    hasError: false,
  })),
  on(TasksActions.createTask, (state, { task }) =>
    adapter.addOne(task, { ...state, isFetching: false })
  ),
  on(TasksActions.createTaskFailed, (state) => ({
    ...state,
    isFetching: false,
    hasError: true,
  })),
  on(TasksActions.updateTaskRequest, (state) => ({
    ...state,
    isFetching: true,
    hasError: false,
  })),
  on(TasksActions.updateTask, (state, task) => {
    return adapter.updateOne(task, { ...state, isFetching: false });
  }),
  on(TasksActions.updateTaskFailed, (state) => ({
    ...state,
    isFetching: false,
    hasError: true,
  })),
  on(TasksActions.deleteTaskRequest, (state) => ({
    ...state,
    isFetching: true,
    hasError: false,
  })),
  on(TasksActions.deleteTask, (state, { id }) =>
    adapter.removeOne(id, { ...state, isFetching: false })
  ),
  on(TasksActions.deleteTaskFailed, (state) => ({
    ...state,
    isFetching: false,
    hasError: true,
  })),
  on(TasksActions.clearAllTasks, (state) => adapter.removeAll(state))
);
