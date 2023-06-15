import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as TasksSelectors from '../../../tasks/selectors/tasks.selectors';
import { Observable } from 'rxjs';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { Target, Task } from 'dddapp-common';

@Component({
  selector: 'dddapp-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  @Input() tasks?: Task[] | null;
  @Input() target?: Target;

  isFetching$: Observable<boolean>;

  @Output()
  assignTask: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  removeTask: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(private store: Store<AppState>) {
    this.isFetching$ = this.store.select(TasksSelectors.selectTasksFetching);
  }
}
