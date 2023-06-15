import { DatePipe, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as TasksSelectors from '../../../tasks/selectors/tasks.selectors';
import { Task } from 'dddapp-common';
import { Target, TargetWageNames } from 'dddapp-common';
import { TargetsService } from '../../services/targets.service';

@Component({
  selector: 'dddapp-target-form',
  templateUrl: './target-form.component.html',
  styleUrls: ['./target-form.component.scss'],
  providers: [DatePipe],
})
export class TargetFormComponent implements OnInit, OnDestroy {
  private _sub: Subscription = new Subscription();
  private _selectedTasksIds: string[] | undefined;
  targetWageNames = TargetWageNames;
  TargetsService = TargetsService;

  private _target?: Target;
  @Input() tasks: Task[] = [];

  @Input()
  set selectedTasksIds(taskIds: string[] | undefined) {
    this._selectedTasksIds = taskIds;
    if (taskIds) {
      this.tasksControls.clear();
      taskIds?.forEach((task) => {
        this.tasksControls.push(this.fb.control(task));
      });
    }
  }
  get selectedTasksIds(): string[] | undefined {
    return this._selectedTasksIds;
  }

  @Input()
  set target(target: Target | undefined) {
    this._target = target;
    if (target) {
      const parsedTarget = {
        ...target,
        deadline: formatDate(target.deadline, 'yyyy-MM-dd', 'pl'),
        creationDate: formatDate(target.creationDate, 'yyyy-MM-dd', 'pl'),
      }
      this.form.patchValue(parsedTarget);
    }
  }

  @Output()
  updatedTarget: EventEmitter<Partial<Target>> = new EventEmitter<Partial<Target>>();

  @Output()
  removedTaskId: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  assignTask: EventEmitter<void> = new EventEmitter<void>();

  parseDate(date: string): Date {
    return new Date(date);
  }
  get target(): Target | undefined {
    return this._target;
  }
  today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  tasks$: Observable<Task[]>

  form = this.fb.group({
    creationDate: new Date().toDateString(),
    title: ['', Validators.required],
    motivation: ['', Validators.required],
    description: ['', Validators.required],
    deadline: ['', Validators.required],
    wage: [4, Validators.required],
    tasks: this.fb.array<string>([]),
    category: [0, Validators.required],
    reward: [''],
    punishment: [''],
  })

  constructor(
    private store: Store<AppState>,
    private fb: NonNullableFormBuilder,
    private datePipe: DatePipe,
  ) {
    this.tasks$ = this.store.select(TasksSelectors.selectTasks);
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  ngOnInit(): void {
    this._sub.add(
      this.form.valueChanges.subscribe((form) => {
        this.updatedTarget.emit({
          ...this.target,
          ...form
        });
        this.isFormValid.emit(!this.form.invalid);
      })
    )
  }

  get tasksControls(): FormArray<FormControl<string>> {
    return this.form.controls['tasks'];
  }

  getCurrentTasks(tasks: Task[]): Task[] {
    return this.applySelectedTasksIdsFilter(tasks);
  }

  removeTask(task: Task) {
    const indexOfRemovedTask = this.tasksControls.value.indexOf(task.id);
    this.tasksControls.removeAt(indexOfRemovedTask);
    this.removedTaskId.emit(task.id);
  }

  applySelectedTasksIdsFilter(tasks: Task[]): Task[] {
    if (this.selectedTasksIds) {
      return tasks.filter(({ id }) => this.selectedTasksIds?.includes(id))
    }
    return tasks;
  }
}
