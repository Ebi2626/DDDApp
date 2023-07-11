import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { ProgressiveTaskItemRealization, FileType, TaskRealizationConfirmation, ProgressiveTask } from 'dddapp-common';
import { ProgressiveTaskRealizationItem } from '../../task-list-realization.component';
import * as TasksActions from '../../../../../tasks/actions/tasks.actions';
import { TokenService } from 'src/app/core/services/token.service';
import { UserInfo } from 'src/app/shared/models/user.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'dddapp-progressive-completions[task]',
  templateUrl: './progressive-completions.component.html',
  styleUrls: ['./progressive-completions.component.scss'],
  changeDetection:  ChangeDetectionStrategy.OnPush,
})
export class ProgressiveCompletionsComponent implements OnDestroy {
  private _tasksPerPeriod?: Array<ProgressiveTaskItemRealization>;
  private _userInfo: UserInfo | undefined;
  private _sub: Subscription = new Subscription();

  TaskRealizationConfirmation = TaskRealizationConfirmation;
  FileType = FileType;

  valueForm: {
    formFields: ProgressiveTaskItemRealization[]
  } = {
    formFields: []
  };

  files: any[] = [];
  filesToUpload: any[] = [];

  @Input() task!: ProgressiveTaskRealizationItem;
  @Input()
  set tasksPerPeriod(tasksPerPeriod: Array<ProgressiveTaskItemRealization>) {
    this._tasksPerPeriod = tasksPerPeriod;
      if(this.valueForm.formFields.length === 0) {
        tasksPerPeriod.forEach((task) => {
          this.valueForm.formFields.push({
            value: task.value,
            index: task.index,
            dueDate: task.dueDate,
            goal: task.goal,
        })});
        console.log('tasksPerPeriod: ', tasksPerPeriod);
      }
  }

  get tasksPerPeriod() {
    return this._tasksPerPeriod || [];
  }


  constructor(
      private store: Store<AppState>,
      private tokenService: TokenService
    ) {
      this._sub.add(
        this.tokenService.userInfo$.subscribe((userInfo) => {
          this._userInfo = userInfo;
        })
      );
  }
  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  private async updateTaskList(id: string, taskCompletions: ProgressiveTask['taskCompletions'], file?: File | string, index?: number) {
    const updatedTask: Partial<ProgressiveTask> = {
      id,
      taskCompletions: taskCompletions,
    }

      this.store.dispatch(TasksActions.updateTaskRequest({task: updatedTask}));
  }

  setNewValue(task: ProgressiveTaskRealizationItem, index: number | undefined, value: any) {
    if(index == undefined) {
      throw new Error('index is undefined');
    }
    const updatedTaskCompletions = task.taskCompletions.map((taskCompletion, taskCompletionIndex) => {
      if (taskCompletionIndex === index) {
        return {
          dueDate: taskCompletion.dueDate,
          goal: taskCompletion.goal,
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
