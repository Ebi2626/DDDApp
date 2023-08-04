import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Category, Task } from 'dddapp-common';
import { TaskModalService } from '../../services/task-modal.service';
import * as TaskActions from '../../actions/tasks.actions';
import { LinkProperties } from 'src/app/shared/components/list-of-links/list-of-links.component';

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

  getLinksForCategories(categories: Category[], task: Task): LinkProperties[] {
    return categories
      .filter((cat) => task.categories.includes(cat.id))
      .map((cat) => ({
        id: cat.id,
        title: cat.title
      }))
  }
}
