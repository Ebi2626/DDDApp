import { createSelector } from "@ngrx/store";
import { AppState } from "src/app/app.state";
import { Category, Target } from "dddapp-common";
import { State, adapter } from "../reducers/categories.reducer";

const selectors = adapter.getSelectors();

export const selectCategoriesState = (state: AppState): State => state.categories;

export const selectCategoriesFetching = createSelector(
  selectCategoriesState,
  ({ isFetching }: State) => isFetching
);

export const selectCategoriesHasError = createSelector(
  selectCategoriesState,
  ({ hasError }: State) => hasError
);

export const selectCategories = createSelector(
  selectCategoriesState,
  (state: State): Category[] => selectors.selectAll(state)
);

export const selectCategoriesCount = createSelector(
  selectCategoriesState,
  (state: State) => selectors.selectTotal(state)
)
