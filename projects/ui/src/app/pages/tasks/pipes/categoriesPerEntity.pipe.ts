import { Pipe, PipeTransform } from '@angular/core';
import { Category } from 'dddapp-common';

@Pipe({
  name: 'categoriesPerEntity'
})
export class CategoriesPerEntity implements PipeTransform {

  transform(categories: Category[], item: any & {categories: string[]}): Category[] {
    return categories.filter((cat) => item.categories.includes(cat.id));
  }

}
