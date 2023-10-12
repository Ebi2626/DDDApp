import { Pipe, PipeTransform } from '@angular/core';
import { Category } from 'dddapp-common';
import * as R from 'ramda';

@Pipe({
  name: 'categoriesPerEntity'
})
export class CategoriesPerEntity implements PipeTransform {

  transform(categories: Category[], item: any & {categories: string[]}): Category[] {
    const userCategories = categories.filter((cat) => item.categories.includes(cat.id));
    const defaultCategory = categories.find(({isDefault}) => isDefault);
    return R.uniq([...(defaultCategory ? [defaultCategory] : []), ...userCategories]);
  }

}
