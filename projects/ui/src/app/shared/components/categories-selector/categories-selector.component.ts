import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from 'dddapp-common';
import { ButtonMetaWithText } from '../button-group/button-group.component';
import { hexToRgba } from '@rpearce/hex';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import * as QueryActions from 'src/app/core/actions/query.actions';

@Component({
  selector: 'dddapp-categories-selector',
  templateUrl: './categories-selector.component.html',
  styleUrls: ['./categories-selector.component.scss']
})
export class CategoriesSelectorComponent {

  private _selectedCategories: string[] = [];

  @Input() categories: Category[] = [];

  @Output()
  selectedCategories: EventEmitter<string[]> = new EventEmitter<string[]>();

  constructor(private store: Store<AppState>){}

  private getContrastTextColor(hexColor: string): string {
    const rgbaColor = hexToRgba(hexColor).slice(0, 3);
    const isColorDark = (rgbaColor.reduce((prev, curr) => prev + curr, 0) / 3) < (255 / 2);
    return isColorDark ? 'white' : 'black';
  }

  mapCategoriesToButtons(categories: Category[]): ButtonMetaWithText[] {
    return categories.map((category) => (
      {
        action: {
          id: category.id,
          isActive: false
        },
        color: category.color,
        text: this.getContrastTextColor(category.color),
        label: category.title
      }
    ));
  }

  updateSelectedCategories({action: {id, isActive}}: ButtonMetaWithText) {
    if(isActive){
      if(!this._selectedCategories.includes(id)){
        this._selectedCategories = [...this._selectedCategories, id];
      }
    } else {
      if(this._selectedCategories.includes(id)) {
        this._selectedCategories = [...this._selectedCategories.filter((val) => val !== id)]
      }
    }
    this.selectedCategories.emit(this._selectedCategories);
    this.store.dispatch(QueryActions.updateCategories({categories: this._selectedCategories}));
    console.log('emitujemy: ', this._selectedCategories);
  }
}
