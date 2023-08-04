import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Category, Target, Task } from 'dddapp-common';
import { Observable, Subscription } from 'rxjs';
import * as tasksSelectors from '../tasks/selectors/tasks.selectors';
import * as targetsSelectors from '../targets/selectors/targets.selectors';
import * as targetsActions from '../targets/actions/targets.actions';
import * as tasksActions from '../tasks/actions/tasks.actions';
import * as categoriesActions from '../categories/actions/categories.actions';
import * as categoriesSelectors from '../categories/selectors/categories.selectors';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { GlobalSpinnerService } from 'src/app/core/layout/components/global-spinner/global-spinner.service';


@Component({
  selector: 'ddda-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  private _sub: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private globalSpinnerService: GlobalSpinnerService,
    ) {
      this.isFetching$ = store.select(targetsSelectors.selectTargetsFetching);
      this.targets$ = store.select(targetsSelectors.selectTargets);
      this.tasks$ = store.select(tasksSelectors.selectTasks);
      this.categories$ = store.select(categoriesSelectors.selectCategories);
      this._sub.add(
        this.isFetching$.subscribe((isFetching) => {
          this.globalSpinnerService.show$.next(isFetching)
        })
      );
    }

  targets$: Observable<Target[]>;
  tasks$: Observable<Task[]>;
  categories$: Observable<Category[]>;
  isFetching$: Observable<boolean>;

  ngOnInit(): void {
    this.store.dispatch(targetsActions.fetchTargets());
    this.store.dispatch(tasksActions.fetchTasks());
    this.store.dispatch(categoriesActions.fetchCategories());
  }

  ngOnChanges() {
    console.log('reredner Dashboard Page');
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

}
