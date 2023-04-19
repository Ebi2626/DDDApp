import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, Observable, Subject, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as TasksSelectors from '../../../tasks/selectors/tasks.selectors';
import * as TasksActions from '../../../tasks/actions/tasks.actions';
import { Task } from 'src/app/pages/tasks/models/tasks.models';
import * as R from 'ramda';
import { Update } from '@ngrx/entity';

interface TaskRealizationItem {
  id: string;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'dddapp-task-list-realization',
  templateUrl: './task-list-realization.component.html',
  styleUrls: ['./task-list-realization.component.scss']
})
export class TaskListRealizationComponent implements OnDestroy {
  private _sub: Subscription = new Subscription();
  @Input()
  set tasks(tasks: Task[]) {
    this.tasks$.next(tasks)
  };

  @Input()
  disabled: boolean = false;

  tasks$: Subject<Task[]> = new Subject<Task[]>();

  tasksInputs: TaskRealizationItem[] = [];

  isFetching$: Observable<boolean>;

  @Output()
  assignTask: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private store: Store<AppState>
  ) {
    this.isFetching$ = store.select(TasksSelectors.selectTasksFetching);
    this._sub.add(
      this.tasks$.pipe<Task[]>(
        distinctUntilChanged<Task[]>(R.equals)
      ).subscribe((tasks: Task[]) => {
        this.tasksInputs = tasks.map(({ title, completed, id }) => ({ id, title, completed }));
      })
    )
  }
  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  toggleCheckboxState(e: Event, task: TaskRealizationItem) {
    e.preventDefault();
    const updatedTask: Update<Task> = {
      changes: {
        completed: !task.completed
      },
      id: task.id
    }
    this.store.dispatch(TasksActions.updateTaskRequest({ task: updatedTask }));
  }

}
