import { Pipe, PipeTransform } from '@angular/core';
import { Category, Task } from 'dddapp-common';

@Pipe({
  name: 'categoriesPerTask'
})
export class CategoriesPerTask implements PipeTransform {

  transform(categories: Category[], task: Task): Category[] {
    return categories.filter((cat) => task.categories.includes(cat.id));
  }

}
