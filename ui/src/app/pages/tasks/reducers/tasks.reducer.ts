import { EntityAdapter } from '@ngrx/entity';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as TasksActions from '../actions/tasks.actions'
import { Task } from '../models/tasks.models';

export const adapter: EntityAdapter<Task> = createEntityAdapter<Task>();

export interface State extends EntityState<Task> {
  isFetching: boolean;
  hasError: boolean;
}

export const initialState: State = adapter.getInitialState({
  hasError: false,
  isFetching: false,
});

export const tasksReducer = createReducer(
  initialState,
  on(
    TasksActions.fetchTasks,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    TasksActions.setTasks,
    (state, { tasks }) => (
      {
        ...adapter.setAll(tasks, state),
        isFetching: false,
      })
  ),
  on(
    TasksActions.fetchTasksFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    TasksActions.createTaskRequest,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    TasksActions.createTask,
    (state, { task }) => adapter.addOne(task, state)
  ),
  on(
    TasksActions.createTaskFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    TasksActions.updateTaskRequest,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    TasksActions.updateTask,
    (state, { updatedTask }) => {
      console.log('old state: ', state);
      console.log('zupdateowany task: ', updatedTask);
      const result = adapter.updateOne(updatedTask, { ...state, isFetching: false });
      console.log('rezultat', result);
      return result;
    }
  ),
  on(
    TasksActions.updateTaskFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    TasksActions.deleteTaskRequest,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    TasksActions.deleteTask,
    (state, { id }) => adapter.removeOne(id, state)
  ),
  on(
    TasksActions.deleteTaskFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),

);