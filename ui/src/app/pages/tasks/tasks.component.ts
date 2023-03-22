import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { GlobalSpinnerService } from 'src/app/core/layout/components/global-spinner/global-spinner.service';
import { Task } from './models/tasks.models';
import * as tasksSelectors from './selectors/tasks.selectors';
import * as tasksActions from './actions/tasks.actions';

@Component({
  selector: 'dddapp-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent {
  openElementIndex?: number;

  tasks$: Observable<Task[]>;
  isFetching$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private globalSpinnerService: GlobalSpinnerService,
  ) {
    this.tasks$ = store.select(tasksSelectors.selectTasks);
    this.isFetching$ = store.select(tasksSelectors.selectTasksFetching)
      .pipe(tap((isFetching) => this.globalSpinnerService.show$.next(isFetching)))
  }

  ngOnInit(): void {
    this.store.dispatch(tasksActions.fetchTasks());
  }

  openElement(elementIndex: number) {
    this.openElementIndex === elementIndex
      ? this.openElementIndex = undefined
      : this.openElementIndex = elementIndex;
  }

  addTask() {
    console.log('Dodajemy cel');
  }

  trackById(_: any, { id }: Task) {
    return id;
  }

  ngOnDestroy(): void {
    this.globalSpinnerService.show$.next(false);
  }
}
