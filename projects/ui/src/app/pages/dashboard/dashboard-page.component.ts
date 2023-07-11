import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Target, Task } from 'dddapp-common';
import { Observable, Subscription } from 'rxjs';
import * as tasksSelectors from '../tasks/selectors/tasks.selectors';
import * as targetsSelectors from '../targets/selectors/targets.selectors';
import * as targetsActions from '../targets/actions/targets.actions';
import * as tasksActions from '../tasks/actions/tasks.actions';
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
      this._sub.add(
        this.isFetching$.subscribe((isFetching) => {
          this.globalSpinnerService.show$.next(isFetching)
        })
      );
    }

  targets$: Observable<Target[]>;
  tasks$: Observable<Task[]>;
  isFetching$: Observable<boolean>;

  ngOnInit(): void {
    this.store.dispatch(targetsActions.fetchTargets());
    this.store.dispatch(tasksActions.fetchTasks());
  }

  ngOnChanges() {
    console.log('reredner Dashboard Page');
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

}
