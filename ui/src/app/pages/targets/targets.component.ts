import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, Observable, Subject, Subscription, tap } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { GlobalSpinnerService } from 'src/app/core/layout/components/global-spinner/global-spinner.service';
import * as targetsActions from './actions/targets.actions';
import * as tasksActions from '../tasks/actions/tasks.actions';
import { Target, TargetStateClass } from './models/targets.model';
import * as targetsSelectors from './selectors/targets.selectors';
import * as tasksSelectors from '../tasks/selectors/tasks.selectors';
import { TargetProgressService } from './services/targetProgress.service';
import { Task } from '../tasks/models/tasks.models';
import * as R from 'ramda';
import { PopupState, TargetModalService } from './services/target-modal.service';

@Component({
  selector: 'dddapp-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetsComponent implements OnInit, OnDestroy {
  private _sub: Subscription = new Subscription();
  TargetStateClass = TargetStateClass;

  openElementIndex?: number;

  targets$: Observable<Target[]>;
  tasks$: Observable<Task[]>;
  isFetching$: Observable<boolean>;
  modalState$: Subject<PopupState> = new Subject<PopupState>();

  constructor(
    private store: Store<AppState>,
    private globalSpinnerService: GlobalSpinnerService,
    private progressService: TargetProgressService,
    private targetModalSerivce: TargetModalService,
  ) {
    this.isFetching$ = store.select(targetsSelectors.selectTargetsFetching);

    this._sub.add(
      this.isFetching$.subscribe((isFetching) => {
        console.log('fetchujemy?: ', isFetching);
        this.globalSpinnerService.show$.next(isFetching)
      })
    );
    this.targets$ = store.select(targetsSelectors.selectTargets);
    this.tasks$ = store.select(tasksSelectors.selectTasks);

    this._sub.add(
      this.targetModalSerivce.modalState$
        .pipe(
          distinctUntilChanged(R.equals),
        ).subscribe((modalState) => {
          this.modalState$.next(modalState as PopupState);
        })
    );

  }

  ngOnInit(): void {
    this.store.dispatch(targetsActions.fetchTargets());
    this.store.dispatch(tasksActions.fetchTasks());
  }

  getTargetTasks(target: Target, tasks: Task[]): Task[] {
    return tasks.filter((task) => target.tasks.includes(task.id));
  }

  openElement(elementIndex: number) {
    this.openElementIndex === elementIndex
      ? this.openElementIndex = undefined
      : this.openElementIndex = elementIndex;
  }

  addTarget() {
    this.targetModalSerivce.openModal();
  }

  trackById(_: any, { id }: Target) {
    return id;
  }

  validateTarget(date: string | Date): TargetStateClass {
    const now = Date.now();
    // const targetDeadline = Date.parse(date);

    return TargetStateClass.IN_PROGRESS;
  }

  getTargetProgress(target: Target, tasks: Task[]): number {
    return this.progressService.getTargetProgress(target, tasks);
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
    this.globalSpinnerService.show$.next(false);
  }
}
