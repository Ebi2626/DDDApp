import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { CyclicTask, CyclicTaskItemRealization, CyclicTaskItemRealizationCheckbox, ProgressiveTask, Task, TaskRealizationConfirmation, TaskType } from 'src/app/pages/tasks/models/tasks.models';
import { ProgressiveTaskRealizationItem, CyclicTaskRealizationItem } from '../../task-list-realization.component';
import * as TasksActions from '../../../../../tasks/actions/tasks.actions';

@Component({
  selector: 'dddapp-cyclic-completions[task]',
  templateUrl: './cyclic-completions.component.html',
  styleUrls: ['./cyclic-completions.component.scss'],
  changeDetection:  ChangeDetectionStrategy.OnPush,
})
export class CyclicCompletionsComponent {
  private _tasksPerPeriod?: Array<CyclicTaskItemRealization>;

  TaskRealizationConfirmation = TaskRealizationConfirmation;

  valueForm: {
    formFields: CyclicTaskItemRealization[]
  } = {
    formFields: []
  };

  @Input() task!: CyclicTask | ProgressiveTask;
  @Input()
  set tasksPerPeriod(tasksPerPeriod: Array<CyclicTaskItemRealization>) {
    this._tasksPerPeriod = tasksPerPeriod;
    if(this.task && (+this.task.verification_method === TaskRealizationConfirmation.NUMBER || +this.task.verification_method === TaskRealizationConfirmation.TEXT)) {
      if(this.valueForm.formFields.length === 0) {
        tasksPerPeriod.forEach((task) => {
          this.valueForm.formFields.push({
          value: task.value,
          index: task.index,
          dueDate: task.dueDate,
        })});
      }
    };
  }
  get tasksPerPeriod() {
    return this._tasksPerPeriod || [];
  }


  constructor(private store: Store<AppState>) {

  }

  private updateTaskList(id: string, taskCompletions: CyclicTask['taskCompletions']) {
    const updatedTask: Partial<CyclicTask> = {
      id,
      taskCompletions: taskCompletions,
    }
    this.store.dispatch(TasksActions.updateTaskRequest({task: updatedTask}));
  }


  toggleCheckboxState(e: Event, task: CyclicTaskRealizationItem, index: number | undefined) {
    e.preventDefault();
    if(index === undefined) {
      throw new Error('index is undefined');
    }
      const updatedTaskCompletions = task.taskCompletions.map((taskCompletion, taskCompletionIndex) => {
        if (taskCompletionIndex === index) {
          return {
            dueDate: taskCompletion.dueDate,
            value: !taskCompletion.value,
          }
        }
        return taskCompletion;
      });

      this.updateTaskList(task.id, updatedTaskCompletions);
  }

  setNewValue(task: CyclicTaskRealizationItem, index: number | undefined, value: any) {
    if(index == undefined) {
      throw new Error('index is undefined');
    }
    const updatedTaskCompletions = task.taskCompletions.map((taskCompletion, taskCompletionIndex) => {
      if (taskCompletionIndex === index) {
        return {
          dueDate: taskCompletion.dueDate,
          value,
        }
      }
      return taskCompletion;
    });
    this.updateTaskList(task.id, updatedTaskCompletions);
  }

  trackByIndex(index: number, obj: any): any {
    return obj.index;
  }
  log(data: any){
    console.log(data);
  }

}
