import { Pipe, PipeTransform } from '@angular/core';
import { IterationDuration } from 'dddapp-common';

@Pipe({
  name: 'periodToText'
})
export class PeriodToTextPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    switch(+value) {
      case IterationDuration.WEEK:
        return 'Tydzień';
      case IterationDuration.MONTH:
        return 'Miesiąc';
      case IterationDuration.YEAR:
        return 'Rok';
      default:
        throw new Error('Invalid duration');
    }
  }

}
