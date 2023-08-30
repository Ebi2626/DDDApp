import { PopupState, TargetModalService } from './services/target-modal.service';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, Observable, Subject, Subscription} from 'rxjs';
import { AppState } from 'src/app/app.state';
import { GlobalSpinnerService } from 'src/app/core/layout/components/global-spinner/global-spinner.service';
import * as targetsActions from './actions/targets.actions';
import * as tasksActions from '../tasks/actions/tasks.actions';
import * as targetsSelectors from './selectors/targets.selectors';
import * as tasksSelectors from '../tasks/selectors/tasks.selectors';
import * as categoriesSelectors from '../categories/selectors/categories.selectors';
import * as categoriesActions from '../categories/actions/categories.actions';
import { TargetsService } from './services/targets.service';
import { Task, Target, Category  } from 'dddapp-common';
import * as R from 'ramda';
import { Page } from 'src/app/core/reducers/query.reducer';

@Component({
  selector: 'dddapp-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetsComponent implements OnInit, OnDestroy {
  private _sub: Subscription = new Subscription();
  targets$: Observable<Target[]>;
  tasks$: Observable<Task[]>;
  categories$: Observable<Category[]>;
  isFetching$: Observable<boolean>;
  modalState$: Subject<PopupState> = new Subject<PopupState>();
  page$: Observable<Page>;

  constructor(
    private store: Store<AppState>,
    private globalSpinnerService: GlobalSpinnerService,
    private targetModalSerivce: TargetModalService,
    protected targetsService: TargetsService,
  ) {

    this.isFetching$ = store.select(targetsSelectors.selectTargetsFetching);
    this._sub.add(
      this.isFetching$.subscribe((isFetching) => {
        this.globalSpinnerService.show$.next(isFetching)
      })
    );
    this.targets$ = store.select(targetsSelectors.selectTargets);
    this.categories$ = store.select(categoriesSelectors.selectCategories);
    this.tasks$ = store.select(tasksSelectors.selectTasks);
    this.page$ = store.select(targetsSelectors.selectTargetsPage);
    this._sub.add(
      this.targetModalSerivce.modalState$
        .pipe(
          distinctUntilChanged(R.equals)
        ).subscribe((modalState) => {
          this.modalState$.next(modalState as PopupState);
        })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(targetsActions.fetchTargets());
    this.store.dispatch(tasksActions.fetchTasks());
    this.store.dispatch(categoriesActions.fetchCategories());
  }

  addTarget = () => {
    this.targetModalSerivce.openModal();
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
    this.globalSpinnerService.show$.next(false);
  }

  changePage(page: Page) {
    this.store.dispatch(targetsActions.changePage({number: page.current}))
  }
}
