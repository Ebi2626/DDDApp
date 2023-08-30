import { AppState } from "src/app/app.state";
import { State } from "../reducers/query.reducer"
import { createSelector } from "@ngrx/store";

export const selectQueryState = (state: AppState): State => state.query;

export const selectCategories = createSelector(
  selectQueryState,
  ({categories}: State) => categories
)

export const selectPage = createSelector(
  selectQueryState,
  ({page}: State) => page
);
