import { EntityAdapter } from '@ngrx/entity';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as TargetsActions from '../actions/targets.actions'
import { Target } from '../models/targets.model';

export const adapter: EntityAdapter<Target> = createEntityAdapter<Target>();

export interface State extends EntityState<Target> {
  isFetching: boolean;
  hasError: boolean;
}

export const initialState: State = adapter.getInitialState({
  hasError: false,
  isFetching: false,
});

export const targetsReducer = createReducer(
  initialState,
  on(
    TargetsActions.fetchTargets,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    TargetsActions.setTargets,
    (state, { targets }) => (
      {
        ...adapter.setAll(targets, state),
        isFetching: false,
      })
  ),
  on(
    TargetsActions.fetchTargetsFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    TargetsActions.createTargetRequest,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    TargetsActions.createTarget,
    (state, { target }) => {
      console.log('tworzony target: ', target);
      return adapter.addOne(target, { ...state, isFetching: false })
    }
  ),
  on(
    TargetsActions.createTargetFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    TargetsActions.updateTargetRequest,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    TargetsActions.updateTarget,
    (state, { target }) => adapter.updateOne(target, { ...state, isFetching: false })
  ),
  on(
    TargetsActions.updateTargetFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    TargetsActions.deleteTargetRequest,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    TargetsActions.deleteTarget,
    (state, { id }) => adapter.removeOne(id, { ...state, isFetching: false })
  ),
  on(
    TargetsActions.deleteTargetFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    TargetsActions.changeTaskRealization,
    (state) => ({ ...state, isFetching: true })
  ),
  on(
    TargetsActions.changeTaskRealizationSuccess,
    TargetsActions.changeTaskRealizationFailed,
    (state) => ({ ...state, isFetching: false })
  ),
);