import { Component, Input } from '@angular/core';
import { Task } from '../../models/tasks.models';

@Component({
  selector: 'dddapp-task-item[task]',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() disabled: boolean = false;
}
