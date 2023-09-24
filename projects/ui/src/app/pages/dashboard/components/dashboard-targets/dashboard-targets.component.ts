import { Component, Input } from '@angular/core';
import { Category, Target, Task } from 'dddapp-common';
import { DateTime } from 'luxon';

@Component({
  selector: 'dddapp-dashboard-targets',
  templateUrl: './dashboard-targets.component.html',
  styleUrls: ['./dashboard-targets.component.scss'],
})
export class DashboardTargetsComponent {
  @Input() targets?: Target[] | null;
  @Input() tasks?: Task[] | null;
  @Input() categories: Category[] = [];

  getCurrentTargets(targets: Target[], tasks: Task[]) {
      const now = DateTime.now();
      return targets
        .filter(
          (target) => DateTime.fromISO(`${target.deadline}`) > now
        )
        .filter((target) => {
          const targetTasks = tasks.filter(({id}) => target.tasks.includes(id));
          const incompletedCurrentTasks = targetTasks.filter((task) => !task.completed && DateTime.fromISO(`${task.deadline}`) > now)
          return incompletedCurrentTasks.length > 0 ? incompletedCurrentTasks : [];
        })
    }
}
