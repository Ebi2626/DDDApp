import { createReducer, on } from "@ngrx/store";
import * as QueryActions from '../actions/query.actions';

export interface Page {
  current: number;
  size: number;
  totalPages: number;
  totalItems: number;
}

export interface State {
  page: Page;
  categories: string[],
}

export const DEFAULT_PAGE_SIZE = 20;

export const initialPage: Page = {
  current: 0,
  size: DEFAULT_PAGE_SIZE,
  totalPages: 1,
  totalItems: 1,
}

export const initialState = {
  page: initialPage,
  categories: [] as string[]
}

export const queryReducer = createReducer(
  initialState,
  on(
    QueryActions.updateCategories,
    (state, {categories}) => ({
      ...state,
      categories,
    })
  ),
  on(
    QueryActions.updatePage,
    (state, {page}) => ({
      ...state,
      page,
    })
  ),
  on(
    QueryActions.clearQuery,
    () => ({...initialState})
  ),
);
