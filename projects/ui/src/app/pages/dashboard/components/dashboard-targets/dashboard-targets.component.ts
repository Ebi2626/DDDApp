import { Component, Input } from "@angular/core";
import { Category, Target, Task } from "dddapp-common";
import { DateTime } from "luxon";
import { ButtonMeta, ButtonMetaWithText } from "src/app/shared/components/button-group/button-group.component";
import { hexToRgba } from '@rpearce/hex';

@Component({
  selector: 'dddapp-dashboard-targets',
  templateUrl: './dashboard-targets.component.html',
  styleUrls: ['./dashboard-targets.component.scss'],
})
export class DashboardTargetsComponent {
  private _targets: Target[] = [];

  @Input()
  set targets(newTargets: Target[] | null) {
    const now = DateTime.now();
    this._targets = newTargets ? newTargets
      .filter((target) => DateTime.fromISO(`${target.deadline}`) > now)
      .filter((target) => target.tasks.length > 0)
      : [];
  }
  get targets() {
    return this._targets;
  }
  @Input() tasks?: Task[] | null;
  @Input() categories: Category[] = [];
}
