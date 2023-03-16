import { Component, Input } from '@angular/core';
import { SpinnerSize } from './spinner.model';

@Component({
  selector: 'dddapp-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

  @Input() show: boolean = false;
  @Input() hasContent: boolean = false;
  @Input() size: SpinnerSize = SpinnerSize.LARGE;

}
