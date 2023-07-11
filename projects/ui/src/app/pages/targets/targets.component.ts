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
import { TargetsService } from './services/targets.service';
import { Task, Target  } from 'dddapp-common';
import * as R from 'ramda';

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
  isFetching$: Observable<boolean>;
  modalState$: Subject<PopupState> = new Subject<PopupState>();

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
    this.tasks$ = store.select(tasksSelectors.selectTasks);
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
  }

  addTarget = () => {
    this.targetModalSerivce.openModal();
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
    this.globalSpinnerService.show$.next(false);
  }
}
