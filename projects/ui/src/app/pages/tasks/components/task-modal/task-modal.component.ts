import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Task, TaskType, TaskTypeNameMap, Option } from 'dddapp-common';
import { TaskModalService } from '../../services/task-modal.service';
import * as TasksActions from '../../actions/tasks.actions';
import * as TasksSelectors from '../../selectors/tasks.selectors';
import { Update } from '@ngrx/entity';
import { filter, Observable, take } from 'rxjs';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'dddapp-task-modal[task]',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent {
  TaskType = TaskType;
  isFormValid: boolean = false;
  taskForm!: Task;
  isFetching$: Observable<boolean>;

  taskTypeOptions: Option[] = Object.keys(TaskTypeNameMap).splice(Object.keys(TaskTypeNameMap).length / 2).map((taskType, i) => ({
    name: TaskTypeNameMap[i],
    value: i,
  }))

  @Input()
  task: Task | undefined;

  taskType?: TaskType;

  constructor(
    private taskModalService: TaskModalService,
    private store: Store<AppState>) {
    this.isFetching$ = this.store.select(TasksSelectors.selectTasksFetching);
  }

  saveChanges() {
    const updatedTask: Update<Task> = {
      changes: {
        ...this.taskForm
      },
      id: this.taskForm!.id
    }
    // Call action
    this.store.dispatch(TasksActions.updateTaskRequest({ task: updatedTask }));

    // Close modal after action success or failed
    this.isFetching$.pipe(
      filter((isFetching) => !isFetching),
      take(1),
    ).subscribe(() => this.closeModal());
    console.log('zapisujemy zmiany: ', this.taskForm)
  }

  addTask() {
    const newTask = {
      ...this.taskForm as Task,
      creationDate: new Date(this.taskForm.creationDate),
      deadline: new Date(this.taskForm.deadline),
    } as Task;

    const task = {
      ...newTask,
      ...(newTask.type !== TaskType.SINGLE ? {
        taskCompletions: TasksService.createTaskCompletionsArray(newTask)
      } : {})
    } as Task

    // Call action
    this.store.dispatch(TasksActions.createTaskRequest({ task }))

    // Close modal after action success or failed
    this.isFetching$.pipe(
      filter((isFetching) => !isFetching),
      take(1),
    ).subscribe(() => this.closeModal());
    console.log('tworzymy nowe zadanie: ', task);
  }

  closeModal() {
    this.taskModalService.closeModal();
  }

}
