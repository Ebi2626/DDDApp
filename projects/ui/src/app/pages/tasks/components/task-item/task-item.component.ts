import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Category, Task } from 'dddapp-common';
import { TaskModalService } from '../../services/task-modal.service';
import * as TaskActions from '../../actions/tasks.actions';

@Component({
  selector: 'dddapp-task-item[task][categories]',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() categories!: Category[];
  @Input() disabled: boolean = false;

  constructor(
    private taskModalService: TaskModalService,
    private store: Store<AppState>
  ) { }

  editTask() {
    this.taskModalService.openModal(this.task);
  }
  deleteTask() {
    this.store.dispatch(TaskActions.deleteTaskRequest({ id: this.task.id }));
  }
}
