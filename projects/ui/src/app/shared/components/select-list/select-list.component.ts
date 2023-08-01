import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

export interface SelectListItem {
  id: string;
  label: string;
  value: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'dddapp-select-list[list]',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectListComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private _list: SelectListItem[] = [];
  private _sub: Subscription = new Subscription();

  @Input()
  set list(newList: SelectListItem[]) {
    this._list = newList
    const formArray: FormArray<FormControl<boolean>> = this.form.get('list') as FormArray<FormControl<boolean>>;
    const newFormControls = this.mapSelectListToFormControls(newList);
    newFormControls.forEach((control, i) => {
      if(newList[i]?.disabled) {
        control.disable();
      }
      formArray.push(control);
    })
  }
  get list(): SelectListItem[] {
    return this._list;
  }

  @Input()
  fetching: boolean = false;

  @Input()
  dropdown: boolean = false;

  @Output()
  changedList: EventEmitter<SelectListItem[]> = new EventEmitter<SelectListItem[]>();

  constructor(private fb: NonNullableFormBuilder) {
    this.form = this.fb.group({
      list: this.fb.array([]),
    });
  }
  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }
  ngOnInit(): void {
    this._sub.add(
      this.form.valueChanges.subscribe((__) => {
        const list = this.form.get('list') as FormArray;
        const updatedList = this.mapFormControlsToSelectList(list)
        this.changedList.emit(updatedList);
      })
    );
  }

  private mapSelectListToFormControls(newList: SelectListItem[]): FormControl<boolean>[] {
    return newList.map((item) => this.fb.control(item.value))
  }

  private mapFormControlsToSelectList(list: FormArray): SelectListItem[] {
    return list.controls.map((control, i: number) => ({
        ...this.list[i],
        value: control.value,
    }))
  }
}
