import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { Task } from "dddapp-common";
import { State, adapter } from "../reducers/tasks.reducer";

const selectors = adapter.getSelectors();

export const selectTasksState = (state: AppState): State => state.tasks;

export const selectTasksFetching = createSelector(
  selectTasksState,
  ({ isFetching }: State) => isFetching
);

export const selectTasksHasError = createSelector(
  selectTasksState,
  ({ hasError }: State) => hasError
);

export const selectTasks = createSelector(
  selectTasksState,
  (state: State): Task[] => selectors.selectAll(state)
);

export const selectTasksCount = createSelector(
  selectTasksState,
  (state: State) => selectors.selectTotal(state)
)
