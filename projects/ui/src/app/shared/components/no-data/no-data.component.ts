import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'dddapp-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoDataComponent {
  @Input() hasContent: boolean = true;
  @Input() ctaText: string = '';
  @Input() ctaAction!: () => void;
}
