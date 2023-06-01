import { Component, Input } from '@angular/core';
import { SingleTaskRealization } from '../../task-list-realization.component';
import { FileType, GRAPHIC_EXTENSIONS, SingleTask, TaskFile, TaskRealizationConfirmation } from 'src/app/pages/tasks/models/tasks.models';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import * as TaskActions from 'src/app/pages/tasks/actions/tasks.actions';
import { TaskType } from 'src/app/pages/tasks/models/tasks.models';
import { UserInfo } from 'src/app/shared/models/user.model';
import { TokenService } from 'src/app/core/services/token.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'dddapp-single-completions',
  templateUrl: './single-completions.component.html',
  styleUrls: ['./single-completions.component.scss']
})
export class SingleCompletionsComponent {
  TaskRealizationConfirmation = TaskRealizationConfirmation;
  FileType = FileType;

  formControl: any;
  fileToUpload: File | null = null;
  file?: TaskFile;

  private _userInfo: UserInfo | undefined;
  private _sub: Subscription = new Subscription();
  private _task!: SingleTaskRealization;
  get task(): SingleTaskRealization {
    return this._task;
  }
  @Input() set task(task: SingleTaskRealization) {
    this._task = task;
    if(+task.verification_method === TaskRealizationConfirmation.FILE && task.value){
      this.file = task.value
    } else {
      this.formControl = this.task.value;
    }
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


  setNewValue(){
    const updatedTask: Partial<SingleTask> = {
      ...this.task, value: this.formControl, type: TaskType.SINGLE, completed: !!this.formControl
    };
    this.store.dispatch(TaskActions.updateTaskRequest({task: updatedTask }))
  }


  selectFile(event: any) {
    if(event !== undefined) {
      const file:File = event.target.files[0];
      if (file) {
        this.fileToUpload = file;
      }
    }
  }

  submitFile(task: SingleTaskRealization) {
    const file = this.fileToUpload;
    const updatedTask: Partial<SingleTask> = {
      ...this.task,
      value: file,
      type: TaskType.SINGLE,
      completed: !!file,
      completionDate: new Date(Date.now()),
    }
    if(file) {
      this.store.dispatch(TaskActions.sendFileAndUpdateSingleTaskRequest({task: updatedTask, file}));
    }
  }

  removeFile() {
    const updatedTask: Partial<SingleTask> = {
      ...this.task,
      value: '',
      type: TaskType.SINGLE,
      completionDate: undefined,
      completed: false
    };
    if(this.file){
      this.store.dispatch(TaskActions.removeFileAndUpdateSingleTaskRequest({task: updatedTask, fileName: this.file.fileName}));
    }
  }

  getFileAddress(task: SingleTaskRealization, image: string): string {
    const taskId = task.id;
    const userId = this._userInfo?.userId;
    if(!taskId || !userId){
      return '';
    }
    return `${environment.api}/${userId}/${taskId}/${image}`;

  }

  toggleCheckboxState(e: Event, task: SingleTaskRealization) {
    e.preventDefault();
    const updatedTask: Partial<SingleTask> = {
      ...this.task,
      value: !task.value,
      type: TaskType.SINGLE,
      completed: !task.value,
      completionDate: !task.value ? new Date(Date.now()) : undefined,
    }
    this.store.dispatch(TaskActions.updateTaskRequest({task: updatedTask }))
  }

  getFileType(fileName: string): FileType {
    const extension = fileName.split('.').pop()?.toLocaleLowerCase();
    if(extension && GRAPHIC_EXTENSIONS.includes(extension)){
      return FileType.IMAGE
    }
    return FileType.TEXT;
  }

}
