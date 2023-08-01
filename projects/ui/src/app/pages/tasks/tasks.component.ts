import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, debounceTime, distinctUntilChanged, filter, take, tap, withLatestFrom } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { GlobalSpinnerService } from 'src/app/core/layout/components/global-spinner/global-spinner.service';
import { Category, Task } from 'dddapp-common';
import * as tasksSelectors from './selectors/tasks.selectors';
import * as tasksActions from './actions/tasks.actions';
import * as categoriesSelectors from '../categories/selectors/categories.selectors';
import * as categoriesActions from '../categories/actions/categories.actions';
import { PopupState, TaskModalService } from './services/task-modal.service';
import { ActivatedRoute } from '@angular/router';
import * as R from 'ramda';

@Component({
  selector: 'dddapp-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent {
  openElementIndex?: number;

  tasks$: Observable<Task[]>;
  categories$: Observable<Category[]>;
  isFetching$: Observable<boolean>;
  modalState$: Observable<PopupState>;

  constructor(
    private store: Store<AppState>,
    private globalSpinnerService: GlobalSpinnerService,
    private taskModalSerivce: TaskModalService,
    private route: ActivatedRoute,
    private element: ElementRef,
  ) {
    this.tasks$ = store.select(tasksSelectors.selectTasks);
    this.modalState$ = this.taskModalSerivce.modalState$;
    this.categories$ = store.select(categoriesSelectors.selectCategories);
    this.isFetching$ = store.select(tasksSelectors.selectTasksFetching)
      .pipe(tap((isFetching) => this.globalSpinnerService.show$.next(isFetching)))
  }

  ngOnInit(): void {
    this.store.dispatch(tasksActions.fetchTasks());
    this.store.dispatch(categoriesActions.fetchCategories());
    combineLatest([
      this.route.queryParams.pipe(
        filter((params) => params['id'])
      ),
      this.tasks$
    ]).pipe(
      distinctUntilChanged((prev, curr) => R.equals(prev, curr)),
      debounceTime(500),
      take(1),
    )
    .subscribe(([params, tasks]) => {
        const indexOfElement = tasks.findIndex(({id}) => id === params['id'])
        const element: HTMLElement = this.element.nativeElement.querySelector(`#taskTitle-${indexOfElement}`);
        if(indexOfElement !== -1) {
          this.openElement(indexOfElement);
          if(element) {
            element.scrollIntoView(true);
          }
        }
      })
  }

  openElement(elementIndex: number) {
    this.openElementIndex === elementIndex
      ? this.openElementIndex = undefined
      : this.openElementIndex = elementIndex;
  }

  addTask() {
    this.taskModalSerivce.openModal();
  }

  trackById(_: any, { id }: Task) {
    return id;
  }

  ngOnDestroy(): void {
    this.globalSpinnerService.show$.next(false);
  }
}
