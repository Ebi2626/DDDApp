import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Target } from '../../models/targets.model';

@Component({
  selector: 'dddapp-target-item[target]',
  templateUrl: './target-item.component.html',
  styleUrls: ['./target-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetItemComponent {

  @Input() target!: Target;
  @Input() disabled: boolean = false;
}
