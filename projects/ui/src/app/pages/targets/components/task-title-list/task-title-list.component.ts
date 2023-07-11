import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { Task } from "dddapp-common";
import { AppState } from "src/app/app.state";
import * as TasksSelectors from '../../../tasks/selectors/tasks.selectors';
import { Observable } from "rxjs";

@Component({
  selector: 'dddapp-task-title-list[tasks]',
  templateUrl: './task-title-list.component.html',
  styleUrls: ['./task-title-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTitleList {
  @Input() tasks!: Task[];

  isFetching$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.isFetching$ = store.select(TasksSelectors.selectTasksFetching);
  }
}
