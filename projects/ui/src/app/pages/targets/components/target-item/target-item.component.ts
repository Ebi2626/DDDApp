import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category, Target, Task } from 'dddapp-common';
import * as TaskSelectors from '../../../tasks/selectors/tasks.selectors';
import * as TargetActions from '../../actions/targets.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { TargetModalService } from '../../services/target-modal.service';
import { LinkProperties } from 'src/app/shared/components/list-of-links/list-of-links.component';

@Component({
  selector: 'dddapp-target-item[target][tasks][categories]',
  templateUrl: './target-item.component.html',
  styleUrls: ['./target-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TargetItemComponent {

  @Input() target!: Target;
  @Input() tasks!: Task[];
  @Input() categories: Category[] = [];
  @Input() disabled: boolean = false;
  @Input() isOnDashboard: boolean = false;
  isFetching$: Observable<boolean>;

  constructor(private store: Store<AppState>, private targetModalService: TargetModalService) {
    this.isFetching$ = this.store.select(TaskSelectors.selectTasksFetching);
  }

  getLinksForCategories(categories: Category[], target: Target): LinkProperties[] {
    return categories
      .filter((cat) => target.categories.includes(cat.id))
      .map((cat) => ({
        id: cat.id,
        title: cat.title
      }))
  }

  deleteTarget(targetId: string) {
    this.store.dispatch(TargetActions.deleteTargetRequest({ id: targetId }));
  }

  editTarget(target: Target) {
    this.targetModalService.openModal(target);
  }
}
