import { Pipe, PipeTransform } from '@angular/core';
import { TaskTypeNameMap } from 'src/app/pages/tasks/models/tasks.models';

@Pipe({
  name: 'taskType'
})
export class TaskTypePipe implements PipeTransform {

  transform(value: number): string {
    return TaskTypeNameMap[value];
  }

}
