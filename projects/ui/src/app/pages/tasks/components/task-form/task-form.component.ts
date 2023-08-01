import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { formatDate } from '@angular/common';
import { Task, TaskType, TaskTypeNameMap, Option, TaskRealizationConfirmationNameMap, IterationDuration, IterationDurationNames, ITERATION_LENGTH, CyclicTask, ProgressiveTask, SingleTask, CyclicTaskItemRealization, ProgressiveTaskItemRealization, Category } from 'dddapp-common';
import { NewTaskForRequest, TaskForm } from '../../models/task.model';
import { SelectListItem } from 'src/app/shared/components/select-list/select-list.component';

@Component({
  selector: 'dddapp-task-form[taskType][categories]',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnDestroy {
  private _taskType: TaskType = TaskType.SINGLE;
  private _task?: Task;
  private _sub: Subscription = new Subscription();
  TaskType = TaskType;
  TaskTypeNameMap = TaskTypeNameMap;

  verificationMethodOptions: Option[] = Object.keys(TaskRealizationConfirmationNameMap).splice(Object.keys(TaskRealizationConfirmationNameMap).length / 2).map((_, i) => ({
    name: TaskRealizationConfirmationNameMap[i],
    value: i,
  }))

  iterationDurationOptions: Option[] = Object.keys(IterationDuration).map((k) => ({
    name: IterationDurationNames[k as ITERATION_LENGTH],
    value: IterationDuration[k as ITERATION_LENGTH],
  })
  );

  @Input()
  set task(task: Task | undefined) {
    this._task = task;
  }
  get task(): Task | undefined {
    return this._task;
  }

  @Input()
  set taskType(type: TaskType) {
    this._taskType = type;
  }
  get taskType(): TaskType {
    return this._taskType;
  }

  @Input()
  categories!: Category[];

  @Input()
  taskTypeOptions!: Option[];

  form?: FormGroup;

  selectList: SelectListItem[] = [];

  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  editedTask: EventEmitter<Task> = new EventEmitter<Task>();

  @Output()
  newTask: EventEmitter<NewTaskForRequest> = new EventEmitter<NewTaskForRequest>();

  constructor(private fb: NonNullableFormBuilder) { }

  private getSelectList(categories: Category[]): SelectListItem[] {
    return categories.map((cat) => ({
      id: cat.id,
      label: cat.title,
      value: !!this.task?.categories.includes(cat.id) ,
      disabled: cat.title === 'Ogólna'
    }))
  }

  ngAfterContentInit() {
    this.form = this.task ? this.formFactory(+this.task.type, this.task) : (this.taskType ? this.formFactory(+this.taskType) : this.formFactory());
    this.selectList = this.getSelectList(this.categories);
    this._sub.add(
      this.form.valueChanges.subscribe((form: TaskForm) => {
        this.isFormValid.emit(!this.form?.invalid);
        if(this.task) {
          const updatedTask = {
            ...this.task,
            ...form,
            categories: this.categories.filter((_, i) => form.categories[i]).map(({id}) => id)
          }
          this.editedTask.emit(updatedTask as Task);
        } else {
          const updatedForm = {
            ...form,
            categories: this.categories.filter((_, i) => form.categories[i]).map(({id}) => id)
          }
          this.newTask.emit(updatedForm);
        }

      })
    );
  }

  private formFactory(taskType: TaskType = TaskType.SINGLE, task?: Task) {

    const taskCompletions: CyclicTaskItemRealization[] | ProgressiveTaskItemRealization[] | undefined = (task as CyclicTask | ProgressiveTask)?.taskCompletions || undefined;
    const taskCategories: string[] = task?.categories || [];

    const singleForm = this.fb.group({
      title: [task?.title || '', Validators.required],
      description: [task?.description || '', Validators.required],
      type: [0, Validators.required],
      deadline: [task?.deadline ? formatDate(task.deadline, 'yyyy-MM-dd', 'pl') : null, Validators.required],
      verification_method: [task?.verification_method || 0, Validators.required],
      creationDate: [task?.creationDate ? formatDate(task.creationDate, 'yyyy-MM-dd', 'pl') : formatDate(new Date(), 'yyyy-MM-dd', 'pl'), Validators.required],
      completed: [task?.completed ?? false],
      categories: this.fb.array<boolean>([]),
      reward: [task?.reward || ''],
      punishment: [task?.punishment || ''],
      completionDate: [task?.completionDate || ''],
    })

    const cyclicForm = this.fb.group({
      title: [task?.title || '', Validators.required],
      description: [task?.description || '', Validators.required],
      type: [1, Validators.required],
      deadline: [task?.deadline ? formatDate(task.deadline, 'yyyy-MM-dd', 'pl') : null, Validators.required],
      verification_method: [task?.verification_method || 0, Validators.required],
      creationDate: [task?.creationDate ? formatDate(task.creationDate, 'yyyy-MM-dd', 'pl') : formatDate(new Date(), 'yyyy-MM-dd', 'pl'), Validators.required],
      completed: [task?.completed ?? false],
      categories: this.fb.array<boolean>([]),
      reward: [task?.reward || ''],
      punishment: [task?.punishment || ''],
      completionDate: [task?.completionDate || ''],
      taskCompletions: this.fb.array([]),
      iterationDuration: [(task as CyclicTask)?.iterationDuration || 0, Validators.required],
      tasksPerIteration: [(task as CyclicTask)?.tasksPerIteration || 1, Validators.required],
    });

    const progressiveForm = this.fb.group({
      title: [task?.title || '', Validators.required],
      description: [task?.description || '', Validators.required],
      type: [2, Validators.required],
      deadline: [task?.deadline ? formatDate(task.deadline, 'yyyy-MM-dd', 'pl') : null, Validators.required],
      verification_method: [2, Validators.required],
      creationDate: [task?.creationDate ? formatDate(task.creationDate, 'yyyy-MM-dd', 'pl') : formatDate(new Date(), 'yyyy-MM-dd', 'pl'), Validators.required],
      completed: [task?.completed ?? false],
      categories: this.fb.array<boolean>([]),
      reward: [task?.reward || ''],
      punishment: [task?.punishment || ''],
      completionDate: [task?.completionDate || ''],
      taskCompletions: this.fb.array([]),
      iterationDuration: [(task as ProgressiveTask)?.iterationDuration || 0, Validators.required],
      tasksPerIteration: [(task as ProgressiveTask)?.tasksPerIteration || 1, Validators.required],
      intervalProgressStepDuration: [(task as ProgressiveTask)?.intervalProgressStepDuration || 1, Validators.required],
      initialTaskValue: [(task as ProgressiveTask)?.initialTaskValue || 0, Validators.required],
      progressStep: [(task as ProgressiveTask)?.progressStep || 0, Validators.required],
    });




    switch (taskType) {
      case 2:
        (taskCompletions as ProgressiveTaskItemRealization[])?.forEach((taskCompletion) => {
          const newControl = this.fb.group({
            dueDate: this.fb.control(taskCompletion.dueDate),
            goal: this.fb.control(taskCompletion.goal),
            value: this.fb.control(taskCompletion.value)
          });
          (progressiveForm.get('taskCompletions') as FormArray).push(newControl);
          this.categories.forEach((category) => {
            const newControl = this.fb.control(taskCategories.includes(category.id));
            (progressiveForm.get('categories') as FormArray).push(newControl);
          });
        })
        return progressiveForm;
      case 1:
        (taskCompletions as CyclicTaskItemRealization[])?.forEach((taskCompletion) => {
          const newControl = this.fb.group({
            dueDate: this.fb.control(taskCompletion.dueDate),
            value: this.fb.control(taskCompletion.value),
          });
          (cyclicForm.get('taskCompletions') as FormArray).push(newControl);
          (cyclicForm.get('taskCompletions') as FormArray).push(newControl);
          this.categories.forEach((category) => {
            const newControl = this.fb.control(taskCategories.includes(category.id));
            (cyclicForm.get('categories') as FormArray).push(newControl);
          });
        })
        return cyclicForm;
      case 0:
        this.categories.forEach((category) => {
          const newControl = this.fb.control(taskCategories.includes(category.id));
          (singleForm.get('categories') as FormArray).push(newControl);
        });
        return singleForm;
      default:
        throw new Error('Wrong taskType');
    }
  }

  updateCategories(selectList: SelectListItem[]) {
    const catFormArray = this.form?.get('categories') as FormArray;
    catFormArray.setValue(selectList.map(({value}) => value));
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
