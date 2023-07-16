import { Component, Input } from '@angular/core';
import { Category } from 'dddapp-common';
import { CategoriesModalService } from '../../services/categories-modal.service';
import * as categoriesActions from '../../actions/categories.actions';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dddapp-category-item[category]',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss']
})
export class CategoryItemComponent {
  @Input()
  category!: Category;

  constructor(
    private categoryModalService: CategoriesModalService,
    private store: Store<AppState>
    ){

  }

  editTask() {
    this.categoryModalService.openModal(this.category);
  }
  deleteTask() {
    this.store.dispatch(categoriesActions.deleteCategoryRequest({ id: this.category.id }));
  }

}
