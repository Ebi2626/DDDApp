import { Update } from '@ngrx/entity/src';
import { createAction, props } from '@ngrx/store';
import { Task } from '../../tasks/models/tasks.models';
import { Target } from '../models/targets.model';

export const fetchTargets = createAction(
  '[Targets] Fetch targets',
);

export const setTargets = createAction(
  '[Targets] Set targets',
  props<{ targets: Target[] }>(),
);

export const fetchTargetsFailed = createAction(
  '[Targets] Fetch targets failed'
);

export const createTargetRequest = createAction(
  '[Targets] Create target request',
  props<{ target: Target }>(),
);

export const createTarget = createAction(
  '[Targets] Create target successful',
  props<{ target: Target }>(),
);

export const createTargetFailed = createAction(
  '[Targets] Create target failed',
);

export const deleteTargetRequest = createAction(
  '[Targets] Delete target request',
  props<{ id: string }>(),
);

export const deleteTarget = createAction(
  '[Targets] Delete target successful',
  props<{ id: string }>(),
);

export const deleteTargetFailed = createAction(
  '[Targets] Delete target failed',
);

export const updateTargetRequest = createAction(
  '[Targets] Update target request',
  props<{ target: Update<Target> }>(),
);

export const updateTarget = createAction(
  '[Targets] Update target successful',
  props<{ target: Update<Target> }>(),
);

export const updateTargetFailed = createAction(
  '[Targets] Update target failed',
);

export const changeTaskRealization = createAction(
  '[Targets] Change task realization',
  props<{ task: Partial<Task> }>(),
);

export const changeTaskRealizationFailed = createAction(
  '[Targets] Change task realization failed',
  props<{ task: Partial<Task> }>(),
);

export const changeTaskRealizationSuccess = createAction(
  '[Targets] Change task realization success',
);