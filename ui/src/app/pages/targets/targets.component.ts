import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { GlobalSpinnerService } from 'src/app/core/layout/components/global-spinner/global-spinner.service';
import * as targetsActions from './actions/targets.actions';
import { Target, TargetStateClass } from './models/targets.model';
import * as targetsSelectors from './selectors/targets.selectors';

@Component({
  selector: 'dddapp-targets',
  templateUrl: './targets.component.html',
  styleUrls: ['./targets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TargetsComponent implements OnInit, OnDestroy {
  TargetStateClass = TargetStateClass;

  openElementIndex?: number;

  targets$: Observable<Target[]>;
  isFetching$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private globalSpinnerService: GlobalSpinnerService,
  ) {
    this.targets$ = store.select(targetsSelectors.selectTargets);
    this.isFetching$ = store.select(targetsSelectors.selectTargetsFetching)
      .pipe(tap((isFetching) => this.globalSpinnerService.show$.next(isFetching)))
  }

  ngOnInit(): void {
    this.store.dispatch(targetsActions.fetchTargets());
  }

  openElement(elementIndex: number) {
    this.openElementIndex === elementIndex
      ? this.openElementIndex = undefined
      : this.openElementIndex = elementIndex;
  }

  addTarget() {
    console.log('Dodajemy cel');
  }

  trackById(_: any, { id }: Target) {
    return id;
  }

  validateTarget(date: string | Date): TargetStateClass {
    const now = Date.now();
    // const targetDeadline = Date.parse(date);

    return TargetStateClass.IN_PROGRESS;
  }

  ngOnDestroy(): void {
    this.globalSpinnerService.show$.next(false);
  }

}
