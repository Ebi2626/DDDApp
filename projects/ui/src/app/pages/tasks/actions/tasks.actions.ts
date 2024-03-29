import { Update } from '@ngrx/entity/src';
import { createAction, props } from '@ngrx/store';
import { CyclicTask, SingleTask, Task } from 'dddapp-common';
import { NewTaskForRequest } from '../models/task.model';
import { UpdateStr } from '@ngrx/entity/src/models';
import { Page } from 'src/app/core/reducers/query.reducer';

export const fetchTasks = createAction('[Tasks] Fetch tasks');

export const setTasks = createAction(
  '[Tasks] Set tasks',
  props<{ tasks: Task[] }>()
);

export const fetchTasksFailed = createAction('[Tasks] Fetch tasks failed');

export const changePage = createAction(
  '[Tasks] Change page',
  props<{ number: number }>()
);

export const setNewPage = createAction(
  '[Tasks] Set new page',
  props<{ page: Page }>()
);

export const changePageFailed = createAction(
  '[Tasks] Changing page failed'
);

export const createTaskRequest = createAction(
  '[Tasks] Create task request',
  props<{ task: NewTaskForRequest }>()
);

export const createTask = createAction(
  '[Tasks] Create task successful',
  props<{ task: Task }>()
);

export const createTaskFailed = createAction('[Tasks] Create task failed');

export const deleteTaskRequest = createAction(
  '[Tasks] Delete task request',
  props<{ id: string }>()
);

export const deleteTask = createAction(
  '[Tasks] Delete task successful',
  props<{ id: string }>()
);

export const deleteTaskFailed = createAction('[Tasks] Delete task failed');

export const sendFileAndUpdateSingleTaskRequest = createAction(
  '[Task] Send file and update single task request',
  props<{ task: Partial<SingleTask>; file: File }>()
);

export const removeFileAndUpdateSingleTaskRequest = createAction(
  '[Task] Remove file and update single task request',
  props<{ task: Partial<SingleTask>; fileName: string }>()
);

export const sendFileAndUpdateCyclicTaskRequest = createAction(
  '[Tasks] Send file and update cyclic task request',
  props<{
    task: Partial<CyclicTask>;
    file: File;
    completionItemIndex: number;
  }>()
);

export const removeFileAndUpdateCyclicTaskRequest = createAction(
  '[Tasks] Remove file and update cyclic task request',
  props<{
    task: Partial<CyclicTask>;
    fileName: string;
    completionItemIndex: number;
  }>()
);

export const updateTaskRequest = createAction(
  '[Tasks] Update task request',
  props<{ task: Partial<Task> }>()
);

export const updateTask = createAction(
  '[Tasks] Update task successful',
  props<UpdateStr<Task>>()
);

export const updateTaskFailed = createAction('[Tasks] Update task failed');

export const updateTasListkRequest = createAction(
  '[Tasks] Update task list request',
  props<{ tasks: Partial<Task>[]; ids: string[] }>()
);

export const updateTaskList = createAction(
  '[Tasks] Update task list successful',
  props<{ updatedTasks: Update<Task>[]; ids: string[] }>()
);

export const updateTaskListFailed = createAction(
  '[Tasks] Update task list failed'
);

export const clearAllTasks = createAction(
  '[Tasks] Clear all tasks'
);
