import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { CyclicTask, CyclicTaskItemRealization, FileType, GRAPHIC_EXTENSIONS, Task, TaskRealizationConfirmation } from 'src/app/pages/tasks/models/tasks.models';
import { CyclicTaskRealizationItem } from '../../task-list-realization.component';
import * as TasksActions from '../../../../../tasks/actions/tasks.actions';
import { TokenService } from 'src/app/core/services/token.service';
import { UserInfo } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';


@Component({
  selector: 'dddapp-cyclic-completions[task]',
  templateUrl: './cyclic-completions.component.html',
  styleUrls: ['./cyclic-completions.component.scss'],
  changeDetection:  ChangeDetectionStrategy.OnPush,
})
export class CyclicCompletionsComponent implements OnDestroy {
  private _tasksPerPeriod?: Array<CyclicTaskItemRealization>;
  private _userInfo: UserInfo | undefined;
  private _sub: Subscription = new Subscription();

  TaskRealizationConfirmation = TaskRealizationConfirmation;
  FileType = FileType;

  valueForm: {
    formFields: CyclicTaskItemRealization[]
  } = {
    formFields: []
  };

  files: any[] = [];
  filesToUpload: any[] = [];

  @Input() task!: CyclicTaskRealizationItem;
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
    } else if ( this.task && +this.task.verification_method === TaskRealizationConfirmation.FILE ) {
      if(this.files?.length === 0) {
        tasksPerPeriod.forEach((task) => {
          this.files.push({
            file: task?.value || '',
            index: task?.index,
          })});
      }
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

  private async updateTaskList(id: string, taskCompletions: CyclicTask['taskCompletions'], file?: File | string, index?: number) {
    const updatedTask: Partial<CyclicTask> = {
      id,
      taskCompletions: taskCompletions,
    }
    if(file) {
      if(index !== undefined) {
        if(typeof file !== 'string') {
          this.store.dispatch(TasksActions.sendFileAndUpdateCyclicTaskRequest({ task: updatedTask, file, completionItemIndex: index as number}))
        } else {
          this.store.dispatch(TasksActions.removeFileAndUpdateCyclicTaskRequest({ task: updatedTask, fileName: file, completionItemIndex: index as number }))
        }
      } else {
        throw new Error('Lack of index of task completion');
      }
    } else {
      this.store.dispatch(TasksActions.updateTaskRequest({task: updatedTask}));
    }
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

  selectFile(event: any, index?: number, task?: CyclicTaskRealizationItem) {
    if(event !== undefined) {
      const file:File = event.target.files[0];
      if (file) {
        this.filesToUpload[index as number] = {
          file,
          index,
        }
      }
    }
  }

  submitFile(task: CyclicTaskRealizationItem, index: number) {
    if(index == undefined) {
      throw new Error('index is undefined');
    }
    const file = this.filesToUpload[index as number].file;
    const updatedTaskCompletions = task.taskCompletions.map((taskCompletion, taskCompletionIndex) => {
      if (taskCompletionIndex === index) {
        return {
          ...taskCompletion,
          value: file,
        }
      }
      return taskCompletion;
    });
    this.updateTaskList(task.id, updatedTaskCompletions, file, index);
  }

  removeFile(fileName: string, task: CyclicTaskRealizationItem, index: number) {
    const updatedTaskCompletions = task.taskCompletions.map((taskCompletion, taskCompletionIndex) => {
      if(taskCompletionIndex === index) {
        return {
          ...taskCompletion,
          value: ''
        }
      }
      return taskCompletion;
    })
    this.updateTaskList(task.id, updatedTaskCompletions, fileName, index);
  }

  trackByIndex(index: number, obj: any): any {
    return obj.index;
  }
  log(data: any){
    console.log(data);
  }

  getFileAddress(task: Task, image: string): string {
    const taskId = task.id;
    const userId = this._userInfo?.userId;
    if(!taskId || !userId){
      return '';
    }
    return `${environment.api}/${userId}/${taskId}/${image}`;

  }

  getFileType(fileName: string): FileType {
    const extension = fileName.split('.').pop()?.toLocaleLowerCase();
    if(extension && GRAPHIC_EXTENSIONS.includes(extension)){
      return FileType.IMAGE
    }
    return FileType.TEXT;
  }

}
