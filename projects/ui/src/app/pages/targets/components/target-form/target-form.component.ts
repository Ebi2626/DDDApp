import { DatePipe, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as TasksSelectors from '../../../tasks/selectors/tasks.selectors';
import { Category, Task } from 'dddapp-common';
import { Target, TargetWageNames } from 'dddapp-common';
import { TargetsService } from '../../services/targets.service';
import { SelectListItem } from 'src/app/shared/components/select-list/select-list.component';
import * as R from 'ramda';

@Component({
  selector: 'dddapp-target-form[categories]',
  templateUrl: './target-form.component.html',
  styleUrls: ['./target-form.component.scss'],
  providers: [DatePipe],
})
export class TargetFormComponent implements OnInit, OnDestroy {
  private _sub: Subscription = new Subscription();
  private _selectedTasksIds: string[] | undefined;
  targetWageNames = TargetWageNames;
  TargetsService = TargetsService;
  selectList: SelectListItem[] = [];

  private _target?: Target;
  @Input() tasks: Task[] = [];
  @Input() categories!: Category[];

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
      const targetCategories: string[] = target.categories || [];
      const categoriesArray = this.form.get('categories') as FormArray;
      this.categories.forEach((category) => {
        categoriesArray.push(this.fb.control(targetCategories.includes(category.id)));
      });
      const parsedTarget = {
        ...target,
        deadline: formatDate(target.deadline, 'yyyy-MM-dd', 'pl'),
        creationDate: formatDate(target.creationDate, 'yyyy-MM-dd', 'pl'),
        categories: this.categories.map((category, i) => targetCategories.includes(category.id)),
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
    categories: this.fb.array<boolean>([]),
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
    this.selectList = this.getSelectList(this.categories);

    this._sub.add(
      this.form.valueChanges.subscribe((form) => {
        this.updatedTarget.emit({
          ...this.target,
          ...R.omit(['categories'], form),
          categories: this.categories.filter((_, i) => form.categories?.[i]).map(({id}) => id),
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

  private getSelectList(categories: Category[]): SelectListItem[] {
    return categories.map((cat) => ({
      id: cat.id,
      label: cat.title,
      value: !!this.target?.categories.includes(cat.id) ,
      disabled: cat.title === 'Ogólna'
    }))
  }

  updateCategories(selectList: SelectListItem[]) {
    const catFormArray = this.form?.get('categories') as FormArray;
    catFormArray.setValue(selectList.map(({value}) => value));
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
