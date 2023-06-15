import { Pipe, PipeTransform } from '@angular/core';
import { TaskTypeNameMap } from 'dddapp-common';

@Pipe({
  name: 'taskType'
})
export class TaskTypePipe implements PipeTransform {

  transform(value: number): string {
    return TaskTypeNameMap[value];
  }

}
