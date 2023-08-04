import { Component, Input } from '@angular/core';
import { filter, Observable, take } from 'rxjs';
import { TargetModalService } from '../../services/target-modal.service';
import * as TargetSelectors from '../../selectors/targets.selectors';
import { TargetsService } from '../../services/targets.service';
import * as TargetActions from '../../actions/targets.actions';
import * as TaskSelectors from '../../../tasks/selectors/tasks.selectors';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { Task, Target, Category } from 'dddapp-common';

@Component({
  selector: 'dddapp-target-modal[categories]',
  templateUrl: './target-modal.component.html',
  styleUrls: ['./target-modal.component.scss']
})
export class TargetModalComponent {
  private _selectedTasksIds: string[] = []
  set selectedTasksIds(tasksIds: string[]) {
    this._selectedTasksIds = tasksIds;
    this.tasks$.pipe(
      take(1)
    ).subscribe((tasks) => {
      this.currentTasks = tasks.filter(({ id }) => tasksIds.includes(id));
    })
  }

  get selectedTasksIds(): string[] {
    return this._selectedTasksIds;
  }
  TargetsService = TargetsService;
  assignTaskModalIsOpen: boolean = false;
  currentTasks: Task[] = [];

  tasks$: Observable<Task[]>;
  isFetching$: Observable<boolean>;

  @Input() target?: Target;
  @Input() categories: Category[] = [];

  constructor(
    private targetModalService: TargetModalService,
    private store: Store<AppState>
  ) {
    this.tasks$ = store.select(TaskSelectors.selectTasks);
    this.isFetching$ = store.select(TargetSelectors.selectTargetsFetching);
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
    this.store.dispatch(TargetActions.updateTargetRequest({target: { ...this.updatedTarget, id: this.updatedTarget?.id } as Target}));
    this.isFetching$.pipe(
      filter((isFetching) => !isFetching),
      take(1),
    ).subscribe(() => this.closeModal());
  }

  addTarget() {
    const target: Target = {
      creationDate: new Date(),
      ...this.updatedTarget
    } as Target;
    this.store.dispatch(TargetActions.createTargetRequest({ target }))
    this.isFetching$.pipe(
      filter((isFetching) => !isFetching),
      take(1),
    ).subscribe(() => this.closeModal());
  }

  removeTask(taskId: string) {
    this.selectedTasksIds = this.selectedTasksIds.filter((id) => id !== taskId);
  }

  assignTasks(taskIds: string[]) {
    this.selectedTasksIds = taskIds;
  }

  patchTasks(newTasksIds: string[]) {
    this.assignTaskModalIsOpen = false;
    this.selectedTasksIds = newTasksIds;
  }

  updatedTarget?: Partial<Target>;
  isFormValid: boolean = false;

}
