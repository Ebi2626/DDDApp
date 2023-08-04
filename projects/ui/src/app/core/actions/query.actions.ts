import { createAction, props } from "@ngrx/store";
import { Page } from "../reducers/query.reducer";


export const updateCategories = createAction(
  '[Query] Update categories',
  props<{ categories: string[] }>(),
);

export const updatePage = createAction(
  '[Query] Update page',
  props<{ page: Page }>(),
);

export const clearQuery = createAction(
  '[Query] Clear state'
);
