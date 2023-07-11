import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Target, Task } from 'dddapp-common';
import * as TaskSelectors from '../../../tasks/selectors/tasks.selectors';
import * as TargetActions from '../../actions/targets.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { TargetModalService } from '../../services/target-modal.service';

@Component({
  selector: 'dddapp-target-item[target]',
  templateUrl: './target-item.component.html',
  styleUrls: ['./target-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetItemComponent {

  @Input() target!: Target;
  @Input() tasks!: Task[];
  @Input() disabled: boolean = false;
  @Input() isOnDashboard: boolean = false;
  isFetching$: Observable<boolean>;

  constructor(private store: Store<AppState>, private targetModalService: TargetModalService) {
    this.isFetching$ = this.store.select(TaskSelectors.selectTasksFetching);
  }

  deleteTarget(targetId: string) {
    this.store.dispatch(TargetActions.deleteTargetRequest({ id: targetId }));
  }

  editTarget(target: Target) {
    this.targetModalService.openModal(target);
  }
}
