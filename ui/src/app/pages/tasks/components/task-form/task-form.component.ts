import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Task, TaskType, TaskTypeNameMap, Option, TaskRealizationConfirmationNameMap, IterationDuration, IterationDurationNames, ITERATION_LENGTH, CyclicTask, ProgressiveTask, SingleTask, CyclicTaskItemRealization, ProgressivTaskItemRealization } from '../../models/tasks.models';
import { v4 as uuidv4 } from 'uuid';
import { Subscription, distinctUntilChanged, Observable } from 'rxjs';
import * as R from 'ramda';
import { formatDate } from '@angular/common';

@Component({
  selector: 'dddapp-task-form[taskType]',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
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
  taskTypeOptions!: Option[];

  form: any;

  @Output()
  isFormValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  taskForm: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(private fb: NonNullableFormBuilder) { }

  ngAfterContentInit() {
    this.form = this.task ? this.formFactory(+this.task.type, this.task) : (this.taskType ? this.formFactory(+this.taskType) : this.formFactory());
    this._sub.add(
      this.form.valueChanges.subscribe((form: unknown) => {
        this.isFormValid.emit(!this.form.invalid);
        this.taskForm.emit(form as Task);
      })
    );
  }

  private formFactory(taskType: TaskType = TaskType.SINGLE, task?: Task) {

    const taskCompletions: CyclicTaskItemRealization[] | ProgressivTaskItemRealization[] | undefined = (task as CyclicTask | ProgressiveTask)?.taskCompletions || undefined;

    const singleForm = this.fb.group({
      id: [task?.id || uuidv4()],
      title: [task?.title || '', Validators.required],
      description: [task?.description || '', Validators.required],
      type: [0, Validators.required],
      deadline: [task?.deadline ? formatDate(task.deadline, 'yyyy-MM-dd', 'pl') : null, Validators.required],
      verification_method: [task?.verification_method || 0, Validators.required],
      creationDate: [task?.creationDate ? formatDate(task.creationDate, 'yyyy-MM-dd', 'pl') : formatDate(new Date(), 'yyyy-MM-dd', 'pl'), Validators.required],
      completed: [task?.completed ?? false],
      category: [task?.category || 0, Validators.required],
      reward: [task?.reward || ''],
      punishment: [task?.punishment || ''],
      completionDate: [task?.completionDate || ''],
    })

    const cyclicForm = this.fb.group({
      id: [task?.id || uuidv4()],
      title: [task?.title || '', Validators.required],
      description: [task?.description || '', Validators.required],
      type: [1, Validators.required],
      deadline: [task?.deadline ? formatDate(task.deadline, 'yyyy-MM-dd', 'pl') : null, Validators.required],
      verification_method: [task?.verification_method || 0, Validators.required],
      creationDate: [task?.creationDate ? formatDate(task.creationDate, 'yyyy-MM-dd', 'pl') : formatDate(new Date(), 'yyyy-MM-dd', 'pl'), Validators.required],
      completed: [task?.completed ?? false],
      category: [task?.category || 0, Validators.required],
      reward: [task?.reward || ''],
      punishment: [task?.punishment || ''],
      completionDate: [task?.completionDate || ''],
      taskCompletions: this.fb.array([]),
      iterationDuration: [(task as CyclicTask)?.iterationDuration || 0, Validators.required],
      tasksPerIteration: [(task as CyclicTask)?.tasksPerIteration || 1, Validators.required],
    });

    const progressiveForm = this.fb.group({
      id: [task?.id || uuidv4()],
      title: [task?.title || '', Validators.required],
      description: [task?.description || '', Validators.required],
      type: [2, Validators.required],
      deadline: [task?.deadline ? formatDate(task.deadline, 'yyyy-MM-dd', 'pl') : null, Validators.required],
      verification_method: [2, Validators.required],
      creationDate: [task?.creationDate ? formatDate(task.creationDate, 'yyyy-MM-dd', 'pl') : formatDate(new Date(), 'yyyy-MM-dd', 'pl'), Validators.required],
      completed: [task?.completed ?? false],
      category: [task?.category || 0, Validators.required],
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
        (taskCompletions as ProgressivTaskItemRealization[])?.forEach((taskCompletion) => {
          const newControl = this.fb.group({
            dueDate: this.fb.control(taskCompletion.dueDate),
            completed: this.fb.control(taskCompletion.completed),
            value: this.fb.control(taskCompletion.value)
          });
          (progressiveForm.get('taskCompletions') as FormArray).push(newControl);
        })
        return progressiveForm;
      case 1:
        (taskCompletions as CyclicTaskItemRealization[])?.forEach((taskCompletion) => {
          const newControl = this.fb.group({
            dueDate: this.fb.control(taskCompletion.dueDate),
            completed: this.fb.control(taskCompletion.completed),
          });
          (cyclicForm.get('taskCompletions') as FormArray).push(newControl);
        })
        return cyclicForm;
      case 0:
        return singleForm;
      default:
        throw new Error('Wrong taskType');
    }
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }
}
