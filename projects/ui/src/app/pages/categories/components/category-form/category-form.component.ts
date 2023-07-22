import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Category } from 'dddapp-common';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as categoriesSelectors from '../../selectors/categories.selectors';
import * as R from 'ramda';
import { NewCategory, NewCategoryForRequest } from '../../models/category.model';

@Component({
  selector: 'dddapp-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  private _category?: Category;
  private _sub: Subscription = new Subscription();
  private _categories: Category[] = [];

  @Output()
  newCategory: EventEmitter<NewCategoryForRequest> = new EventEmitter<NewCategoryForRequest>();
  @Output()
  editedCategory: EventEmitter<Category> = new EventEmitter<Category>();

  @Input()
  set category(category: Category | undefined) {
    this._category = category;
    if(category){
      this.form.setValue({
        title: category.title,
        description: category.descritpion,
        color: category.color,
      })
    }
  }
  get category(): Category | undefined {
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

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged<NewCategory>(R.equals)
      )
      .subscribe((form) => {
        if(this.category) {
          const editedCategory: Category = {
            ...this.category,
            title: form.title,
            descritpion: form.description,
            color: form.color,
          }
          console.log('emitujemy kategorię: ', editedCategory);
          this.editedCategory.emit(editedCategory);
        } else {
          const newCategory: NewCategoryForRequest = {
            title: form.title,
            descritpion: form.description,
            color: form.color,
            isDefault: false,
            targets: [],
            tasks: [],
          }
          this.newCategory.emit(newCategory);
        }
      });
  }

  public form = this.fb.group({
    title: ['', [Validators.required, Validators.min(3)]],
    description: [''],
    color: ['#000000', [this.forbiddenNameValidator]]

  }, {nonNullable: true})

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
