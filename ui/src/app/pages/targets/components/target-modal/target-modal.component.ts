import { Component, Input } from '@angular/core';
import { distinctUntilChanged, Observable, Subscription, take } from 'rxjs';
import { Target } from '../../models/targets.model';
import { PopupState, TargetModalService } from '../../services/target-modal.service';
import * as R from 'ramda';
import { TargetsService } from '../../services/targets.service';
import * as TaskSelectors from '../../../tasks/selectors/tasks.selectors';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Task } from 'src/app/pages/tasks/models/tasks.models';

@Component({
  selector: 'dddapp-target-modal',
  templateUrl: './target-modal.component.html',
  styleUrls: ['./target-modal.component.scss']
})
export class TargetModalComponent {
  selectedTasksIds: string[] = [];
  TargetsService = TargetsService;
  assignTaskModalIsOpen: boolean = false;

  tasks$: Observable<Task[]>;

  @Input() target?: Target;

  constructor(
    private targetModalService: TargetModalService,
    private store: Store<AppState>
  ) {
    this.tasks$ = store.select(TaskSelectors.selectTasks);
  }

  ngOnInit() {
    this.tasks$.pipe(take(1)).subscribe((tasks) => {
      this.selectedTasksIds = this.target ? TargetsService.getTargetTasks(this.target, tasks).map(({ id }) => id) : [];
    });
  }

  closeModal() {
    this.targetModalService.closeModal();
  }

  saveChanges() {
    console.log('zapisujemy zmiany: ', this.updatedTarget);
  }

  addTarget() {
    console.log('dodajemy cel: ', this.updatedTarget);
  }

  removeTask(taskId: string) {
    this.selectedTasksIds = this.selectedTasksIds.filter((id) => id !== taskId);
  }

  assignTasks(taskIds: string[]) {
    this.selectedTasksIds = taskIds;
  }

  patchTasks(assignedTasks: boolean[], tasks: Task[]) {
    this.selectedTasksIds = tasks
      .filter((el: Task, i: number) => assignedTasks[i])
      .map(({ id }) => id);
    this.assignTaskModalIsOpen = false;
  }

  updatedTarget?: Partial<Target>;
  isFormValid: boolean = false;

}
