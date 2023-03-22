import { Pipe, PipeTransform } from '@angular/core';
import { TaskRealizationConfirmationNameMap } from 'src/app/pages/tasks/models/tasks.models';

@Pipe({
  name: 'verificationMethod'
})
export class VerificationMethodPipe implements PipeTransform {

  transform(value: number): string {
    return TaskRealizationConfirmationNameMap[value];
  }

}
