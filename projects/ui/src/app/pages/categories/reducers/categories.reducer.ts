import { EntityAdapter } from '@ngrx/entity';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import * as CategoriesActions from '../actions/categories.actions'
import { Category } from 'dddapp-common';

export const adapter: EntityAdapter<Category> = createEntityAdapter<Category>();

export interface State extends EntityState<Category> {
  isFetching: boolean;
  hasError: boolean;
}

export const initialState: State = adapter.getInitialState({
  hasError: false,
  isFetching: false,
});

export const categoriesReducer = createReducer(
  initialState,
  on(
    CategoriesActions.fetchCategories,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    CategoriesActions.setCategories,
    (state, { categories }) => ({
        ...adapter.setAll(categories, state),
        isFetching: false,
      })
  ),
  on(
    CategoriesActions.fetchCategoriesFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    CategoriesActions.createCategoryRequest,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    CategoriesActions.createCategory,
    (state, { category }) =>  adapter.addOne(category, { ...state, isFetching: false })
  ),
  on(
    CategoriesActions.createCategoryFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    CategoriesActions.updateCategoryRequest,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    CategoriesActions.updateCategory,
    (state, { category }) => adapter.updateOne(category, { ...state, isFetching: false })
  ),
  on(
    CategoriesActions.updateCategoryFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  ),
  on(
    CategoriesActions.deleteCategoryRequest,
    (state) => ({
      ...state,
      isFetching: true,
      hasError: false,
    })
  ),
  on(
    CategoriesActions.deleteCategory,
    (state, { id }) => adapter.removeOne(id, { ...state, isFetching: false })
  ),
  on(
    CategoriesActions.deleteCategoryFailed,
    (state) => ({
      ...state,
      isFetching: false,
      hasError: true,
    })
  )
);
