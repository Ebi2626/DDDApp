import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Task } from 'src/app/pages/tasks/models/tasks.models';
import { Store } from '@ngrx/store';
import * as R from 'ramda';
import * as TasksSelectors from '../../../../../tasks/selectors/tasks.selectors';
import { Subscription, Subject, Observable, distinctUntilChanged, combineLatest } from 'rxjs';
import { AppState } from 'src/app/app.state';

interface TaskExistanceItem {
  id: string;
  title: string;
  isAssigned: boolean;
}

@Component({
  selector: 'dddapp-assign-targets-modal',
  templateUrl: './assign-targets-modal.component.html',
  styleUrls: ['./assign-targets-modal.component.scss']
})
export class AssignTargetsModalComponent {
  private _sub: Subscription = new Subscription();
  private _allTasks$: Observable<Task[]>;

  @Input()
  set currentTasks(tasks: Task[]) {
    this.currentTasks$.next(tasks)
  };

  currentTasks$: Subject<Task[]> = new Subject<Task[]>();

  tasksExistanceInputs: TaskExistanceItem[] = [];

  isFetching$: Observable<boolean>;

  @Output()
  assignTasks: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Output()
  closeModal: EventEmitter<void> = new EventEmitter<void>();

  saveChanges(): void {
    const newTaskList: string[] = this.tasksExistanceInputs.filter(({ isAssigned }) => isAssigned)?.map(({ id }) => id);
    this.assignTasks.emit(newTaskList);
  }

  constructor(
    private store: Store<AppState>
  ) {
    this._allTasks$ = store.select(TasksSelectors.selectTasks);
    this.isFetching$ = store.select(TasksSelectors.selectTasksFetching);
    this._sub.add(
      combineLatest([
        this._allTasks$,
        this.currentTasks$,
      ]).pipe<[Task[], Task[]]>(
        distinctUntilChanged<[Task[], Task[]]>(R.equals)
      ).subscribe(([tasks, currentTasks]) => {
        const updatedFields = this.mapToTaskExistanceItem(tasks, currentTasks);
        this.tasksExistanceInputs = updatedFields;
      })
    )
  }

  mapToTaskExistanceItem(tasks: Task[], currentTasks: Task[]): TaskExistanceItem[] {
    return tasks.map(({ title, id }) => ({ id, title, isAssigned: !!currentTasks.find((curr) => curr.id === id) }))
  }
  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
}
