import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, NonNullableFormBuilder } from '@angular/forms';
import { Task } from 'src/app/pages/tasks/models/tasks.models';
import { TargetsService } from 'src/app/pages/targets/services/targets.service';
import { Target } from 'src/app/pages/targets/models/targets.model';

@Component({
  selector: 'dddapp-assign-targets-modal[target]',
  templateUrl: './assign-targets-modal.component.html',
  styleUrls: ['./assign-targets-modal.component.scss']
})
export class AssignTargetsModalComponent {
  @Input() selectedTasksIds: string[] = [];
  @Input() tasks: Task[] = [];
  @Input() target?: Target;

  form = this.fb.group({
    tasksControls: this.fb.array<boolean>([]),
  });

  @Output() changedTasks: EventEmitter<boolean[]> = new EventEmitter<boolean[]>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  get updatedTasks(): boolean[] {
    return this.form.controls['tasksControls'].value;
  }

  constructor(private fb: NonNullableFormBuilder) {
    this.form.valueChanges.subscribe((data) => {
      console.log(data);
    })
  }

  ngOnInit() {
    this.setForm(this.tasks);
  }

  setForm(tasks: Task[]) {
    if (!this.target) {
      tasks.forEach((task) => {
        this.form.controls['tasksControls'].push(this.createFormControl(false));
      });
    } else {
      tasks.forEach((task) => {
        this.form.controls['tasksControls'].push(this.createFormControl(this.selectedTasksIds.includes(task.id)));
      });
    }
  }

  createFormControl(isChecked: boolean): FormControl<boolean> {
    return this.fb.control(isChecked);
  }

  saveChanges() {
    this.changedTasks.emit(this.updatedTasks);
  }
}
