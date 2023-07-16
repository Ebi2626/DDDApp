import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Category } from 'dddapp-common';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as categoriesSelectors from '../../selectors/categories.selectors';

@Component({
  selector: 'dddapp-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  private _category?: Category;
  private _sub: Subscription = new Subscription();
  private _categories: Category[] = [];

  @Input()
  set category(category: Category | undefined) {
    this._category = category;
  }
  get category():  Category | undefined {
    return this._category;
  }

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) {
    this._sub.add(
      this.store.select(categoriesSelectors.selectCategories).subscribe(
        (categories) => this._categories = categories
        )
    )
  }

  public form = this.fb.group({
    title: ['', [Validators.required, Validators.min(3)]],
    desciption: [''],
    color: ['#000000', [this.forbiddenNameValidator]]

  })

  private forbiddenNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const colorInUse = this._categories.some(({color}) => color === control.value);
      return colorInUse ? { colorInUse: {value: control.value}} : null;
    };
  }

  ngOnDestroy() {
    this._sub.unsubscribe();
  }

}
