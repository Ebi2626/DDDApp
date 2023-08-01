import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Task, TaskType, TaskTypeNameMap, Option, CyclicTask, ProgressiveTask, Category } from 'dddapp-common';
import { TaskModalService } from '../../services/task-modal.service';
import * as TasksActions from '../../actions/tasks.actions';
import * as TasksSelectors from '../../selectors/tasks.selectors';
import { Update } from '@ngrx/entity';
import { filter, Observable, take } from 'rxjs';
import { TasksService } from '../../services/tasks.service';
import { NewTaskForRequest } from '../../models/task.model';
import * as R from 'ramda';

@Component({
  selector: 'dddapp-task-modal[task][categories]',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent {
  TaskType = TaskType;
  isFormValid: boolean = false;
  editedTask?: Task;
  createdTask?: NewTaskForRequest;
  isFetching$: Observable<boolean>;

  taskTypeOptions: Option[] = Object.keys(TaskTypeNameMap).splice(Object.keys(TaskTypeNameMap).length / 2).map((taskType, i) => ({
    name: TaskTypeNameMap[i],
    value: i,
  }))

  @Input()
  task: Task | undefined;
  @Input()
  categories!: Category[];

  taskType?: TaskType;

  constructor(
    private taskModalService: TaskModalService,
    private store: Store<AppState>) {
    this.isFetching$ = this.store.select(TasksSelectors.selectTasksFetching);
  }

  saveChanges() {
    if(this.editedTask){
      const task = {
        ...R.omit(['creationDate'], this.editedTask)
      } as Partial<Task>;
      // Call action
      this.store.dispatch(TasksActions.updateTaskRequest({ task }));

      // Close modal after action success or failed
      this.isFetching$.pipe(
        filter((isFetching) => !isFetching),
        take(1),
      ).subscribe(() => this.closeModal());
    }
  }

  addTask() {
    if(this.createdTask) {
      const newTask = {
        ...this.createdTask,
        creationDate: new Date(this.createdTask.creationDate),
        deadline: new Date(this.createdTask.deadline),
      };

      const task = {
        ...newTask,
        ...(newTask.type !== TaskType.SINGLE ? {
          taskCompletions: TasksService.createTaskCompletionsArray(newTask as CyclicTask | ProgressiveTask)
        } : {})
      } as NewTaskForRequest

      // Call action
      this.store.dispatch(TasksActions.createTaskRequest({ task }))

      // Close modal after action success or failed
      this.isFetching$.pipe(
        filter((isFetching) => !isFetching),
        take(1),
      ).subscribe(() => this.closeModal());
    }

  }

  closeModal() {
    this.taskModalService.closeModal();
  }

}
