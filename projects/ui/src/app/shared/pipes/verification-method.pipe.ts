import { Pipe, PipeTransform } from '@angular/core';
import { TaskRealizationConfirmationNameMap } from 'dddapp-common'

@Pipe({
  name: 'verificationMethod'
})
export class VerificationMethodPipe implements PipeTransform {

  transform(value: number): string {
    return TaskRealizationConfirmationNameMap[value];
  }

}
