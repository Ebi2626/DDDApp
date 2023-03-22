import { Update } from '@ngrx/entity/src';
import { createAction, props } from '@ngrx/store';
import { Task } from '../models/tasks.models';

export const fetchTasks = createAction(
  '[Tasks] Fetch tasks',
);

export const setTasks = createAction(
  '[Tasks] Set tasks',
  props<{ tasks: Task[] }>(),
);

export const fetchTasksFailed = createAction(
  '[Tasks] Fetch tasks failed'
);

export const createTaskRequest = createAction(
  '[Tasks] Create task request',
  props<{ task: Task }>(),
);

export const createTask = createAction(
  '[Tasks] Create task successful',
  props<{ task: Task }>(),
);

export const createTaskFailed = createAction(
  '[Tasks] Create task failed',
);

export const deleteTaskRequest = createAction(
  '[Tasks] Delete task request',
  props<{ id: string }>(),
);

export const deleteTask = createAction(
  '[Tasks] Delete task successful',
  props<{ id: string }>(),
);

export const deleteTaskFailed = createAction(
  '[Tasks] Delete task failed',
);

export const updateTaskRequest = createAction(
  '[Tasks] Update task request',
  props<{ task: Partial<Task> }>(),
);

export const updateTask = createAction(
  '[Tasks] Update task successful',
  props<{ updatedTask: Update<Task> }>(),
);

export const updateTaskFailed = createAction(
  '[Tasks] Update task failed',
);

export const updateTasListkRequest = createAction(
  '[Tasks] Update task list request',
  props<{ tasks: Partial<Task>[], ids: string[] }>(),
);

export const updateTaskList = createAction(
  '[Tasks] Update task list successful',
  props<{ updatedTasks: Update<Task>[], ids: string[] }>(),
);

export const updateTaskListFailed = createAction(
  '[Tasks] Update task list failed',
);