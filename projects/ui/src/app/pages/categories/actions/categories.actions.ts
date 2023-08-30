import { Update } from '@ngrx/entity/src';
import { createAction, props } from '@ngrx/store';
import { Category } from 'dddapp-common';
import { NewCategoryForRequest } from '../models/category.model';

export const fetchCategories = createAction(
  '[Categories] Fetch categories',
);

export const setCategories = createAction(
  '[Categories] Set categories',
  props<{ categories: Category[] }>(),
);

export const fetchCategoriesFailed = createAction(
  '[Categories] Fetch categories failed'
);

export const createCategoryRequest = createAction(
  '[Categories] Create category request',
  props<{ category: NewCategoryForRequest }>(),
);

export const createCategory = createAction(
  '[Categories] Create category successful',
  props<{ category: Category }>(),
);

export const createCategoryFailed = createAction(
  '[Categories] Create category failed',
);

export const deleteCategoryRequest = createAction(
  '[Categories] Delete category request',
  props<{ id: string }>(),
);

export const deleteCategory = createAction(
  '[Categories] Delete category successful',
  props<{ id: string }>(),
);

export const deleteCategoryFailed = createAction(
  '[Categories] Delete category failed',
);

export const updateCategoryRequest = createAction(
  '[Categories] Update category request',
  props<{ category: Category }>(),
);

export const updateCategory = createAction(
  '[Categories] Update category successful',
  props<{ category: Update<Category> }>(),
);

export const updateCategoryFailed = createAction(
  '[Categories] Update category failed',
);

export const clearAllCategories = createAction(
  '[Categories] Clear all categories'
);
