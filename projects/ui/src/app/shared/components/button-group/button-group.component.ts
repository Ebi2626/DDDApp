import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { log } from 'console';
import * as R from 'ramda';

export interface ButtonToggleAction {
  id: any;
  isActive: boolean;
}

export interface ButtonMeta {
  color: string;
  label: string;
  action: ButtonToggleAction;
  disabled?: boolean;
}

export interface ButtonMetaWithText extends ButtonMeta {
  text: string;
}

@Component({
  selector: 'dddapp-button-group',
  templateUrl: './button-group.component.html',
  styleUrls: ['./button-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonGroupComponent {
  form: FormGroup;
  private _buttons: ButtonMetaWithText[] = [];
  @Input()
  set buttons(btns: ButtonMetaWithText[]) {
    this._buttons = btns;
    const buttonsForm = this.form.get('buttons') as FormArray;
    if (!buttonsForm.controls.length) {
      btns.forEach((button) => {
        const newButtonControl = this.fb.control(button.action.isActive);
        buttonsForm.push(newButtonControl);
      });
    }
  }
  get buttons() {
    return this._buttons;
  }

  @Output()
  action: EventEmitter<ButtonMetaWithText> =
    new EventEmitter<ButtonMetaWithText>();

  constructor(private fb: NonNullableFormBuilder) {
    this.form = fb.group({
      buttons: fb.array([]),
    });
  }

  get buttonForms() {
    return this.form.get('buttons') as FormArray;
  }

  buttonClick(isChecked: boolean, buttonIndex: number) {
    this.buttonForms.at(buttonIndex).setValue(!isChecked);
    const newButtonState: ButtonMetaWithText = {
      ...this.buttons[buttonIndex],
      action: {
        ...this.buttons[buttonIndex].action,
        isActive: !isChecked,
      }
    }
    this.action.emit(newButtonState);
  }
}
