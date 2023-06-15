import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { Target } from "dddapp-common";
import { State, adapter } from "../reducers/targets.reducer";

const selectors = adapter.getSelectors();

export const selectTargetsState = (state: AppState): State => state.targets;

export const selectTargetsFetching = createSelector(
  selectTargetsState,
  ({ isFetching }: State) => isFetching
);

export const selectTargetsHasError = createSelector(
  selectTargetsState,
  ({ hasError }: State) => hasError
);

export const selectTargets = createSelector(
  selectTargetsState,
  (state: State): Target[] => selectors.selectAll(state)
);

export const selectTargetsCount = createSelector(
  selectTargetsState,
  (state: State) => selectors.selectTotal(state)
)
