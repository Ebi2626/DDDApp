import { Component, Input } from '@angular/core';
import { Category } from 'dddapp-common';
import { Observable, filter, take } from 'rxjs';
import { CategoriesModalService } from '../../services/categories-modal.service';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import * as categoriesSelectors from '../../selectors/categories.selectors';
import * as categoriesActions from '../../actions/categories.actions';

@Component({
  selector: 'dddapp-category-modal',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss']
})
export class CategoryModalComponent {

  isFetching$: Observable<boolean>;
  updatedCategory?: Partial<Category>;


  @Input()
  category?: Category;

  constructor(
    private store: Store<AppState>,
    private categoryModalService: CategoriesModalService,

  ){
    this.isFetching$ = store.select(categoriesSelectors.selectCategoriesFetching);
  }

  closeModal() {
    this.categoryModalService.closeModal();
  }

  saveChanges() {
    this.store.dispatch(categoriesActions.updateCategoryRequest({category: { ...this.updatedCategory, id: this.updatedCategory?.id } as Category}));
    this.isFetching$.pipe(
      filter((isFetching) => !isFetching),
      take(1),
    ).subscribe(() => this.closeModal());
  };

  addCategory() {
    if(this.category){
      this.store.dispatch(categoriesActions.createCategory({ category: this.category }))
      this.isFetching$.pipe(
        filter((isFetching) => !isFetching),
        take(1),
      ).subscribe(() => this.closeModal());
    }
  }


}
