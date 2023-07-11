import { Component } from '@angular/core';
import { Observable, Subject, Subscription, distinctUntilChanged } from 'rxjs';
import { Category } from './models/categories.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { GlobalSpinnerService } from 'src/app/core/layout/components/global-spinner/global-spinner.service';
import { CategoriesService } from './services/categories.service';
import { CategoriesModalService, PopupState } from './services/categories-modal.service';
import * as categoriesSelectors from './selectors/categories.selectors';
import * as R from 'ramda';

@Component({
  selector: 'dddapp-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  private _sub: Subscription = new Subscription();
  fetching$: Observable<boolean>;
  categories$: Observable<Category[]>;
  modalState$: Subject<PopupState> = new Subject<PopupState>();

  constructor(
    private store: Store<AppState>,
    private globalSpinnerService: GlobalSpinnerService,
    private categoriesModalService: CategoriesModalService,
    protected categoriesService: CategoriesService,
  ) {
    this.fetching$ = store.select(categoriesSelectors.selectCategoriesFetching);
    this._sub.add(
      this.fetching$.subscribe((fetching) => {
        this.globalSpinnerService.show$.next(fetching);
      })
    );
    this.categories$ = store.select(categoriesSelectors.selectCategories);
    this._sub.add(
      this.categoriesModalService.modalState$
        .pipe(
          distinctUntilChanged<PopupState>(R.equals)
        ).subscribe((modalState) => {
          this.modalState$.next(modalState);
        })
    );
  }


  addCategory() {

  }
}
