import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { CategoriesService } from "../services/categories.service";
import * as CategoriesActions from "../actions/categories.actions";
import * as CategoriesSelectors from "../selectors/categories.selectors";
import { catchError, map, of, switchMap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/app.state";


@Injectable()
export class CategorieEffects {
  fetchCategories$ = createEffect(
    () => this.actions$.pipe(
      ofType(CategoriesActions.fetchCategories),
      withLatestFrom(
        this.store.select(CategoriesSelectors.selectCategories)
      ),
      switchMap(([_, categories]) => {
        if (categories.length) {
          return of(categories).pipe(
            map((categories$) => CategoriesActions.setCategories({ categories }))
          )
        }
        return this.categoriesService.fetchCategories().pipe(
          map(({ categories }) => CategoriesActions.setCategories({ categories })),
          catchError(() => of(CategoriesActions.fetchCategoriesFailed()))
        )
      }),
    ));

  deleteCategory$ = createEffect(
    () => this.actions$.pipe(
      ofType(CategoriesActions.deleteCategoryRequest),
      switchMap(({ id }) => this.categoriesService.deleteCategory(id).pipe(
        map(({ id }) => CategoriesActions.deleteCategory({ id })),
        catchError(() => of(CategoriesActions.deleteCategoryFailed()))
      ))
    ));

  updateTarget$ = createEffect(
    () => this.actions$.pipe(
      ofType(CategoriesActions.updateCategoryRequest),
      switchMap(({ category }) => this.categoriesService.updateCategory(category).pipe(
        map(({ category }) => CategoriesActions.updateCategory({
          category: {
            changes: category,
            id: category.id
          }
        })),
        catchError(() => of(CategoriesActions.updateCategoryFailed()))
      ))
    ))

  createTarget$ = createEffect(
    () => this.actions$.pipe(
      ofType(CategoriesActions.createCategoryRequest),
      switchMap(({ category }) => this.categoriesService.createTarget(category).pipe(
        map(({ category }) => CategoriesActions.createCategory({
          category
        })),
        catchError(() => of(CategoriesActions.createCategoryFailed()))
      ))
    ))

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private categoriesService: CategoriesService,
  ) { }
}
