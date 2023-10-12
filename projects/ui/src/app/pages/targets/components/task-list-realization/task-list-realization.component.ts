import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, Observable, Subject, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.state';
import * as TasksSelectors from '../../../tasks/selectors/tasks.selectors';
import * as TasksActions from '../../../tasks/actions/tasks.actions';
import { WEEK_DURATION, MONTH_DURATION, YEAR_DURATION, CyclicTaskItemRealization, ProgressiveTaskItemRealization, Task, TaskType, TaskRealizationConfirmation } from 'dddapp-common';
import * as R from 'ramda';
import { DateTime } from 'luxon';

interface BaseTaskRealizationItem {
  id: string;
  title: string;
  completed: boolean;
  type: TaskType;
  verification_method: TaskRealizationConfirmation;
}

export interface SingleTaskRealization extends BaseTaskRealizationItem {
  value: any;
}

export interface CyclicTaskRealizationItem extends BaseTaskRealizationItem {
  period: {
    duration: number;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  };
  taskCompletions: CyclicTaskItemRealization[];
}

export interface ProgressiveTaskRealizationItem extends BaseTaskRealizationItem {
  period: {
    duration: number;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
  };
  taskCompletions: ProgressiveTaskItemRealization[];
}

type TaskRealizationItem = ProgressiveTaskRealizationItem | CyclicTaskRealizationItem | BaseTaskRealizationItem;

@Component({
  selector: 'dddapp-task-list-realization',
  templateUrl: './task-list-realization.component.html',
  styleUrls: ['./task-list-realization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListRealizationComponent implements OnDestroy {
  TaskType = TaskType;
  private _sub: Subscription = new Subscription();

  @Input()
  set tasks(tasks: Task[]) {
    this.tasks$.next(tasks)
  };

  @Input()
  disabled: boolean = false;

  tasks$: Subject<Task[]> = new Subject<Task[]>();

  tasksInputs?: TaskRealizationItem[];

  isFetching$: Observable<boolean>;

  @Output()
  assignTask: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private store: Store<AppState>
  ) {
    this.isFetching$ = store.select(TasksSelectors.selectTasksFetching);
    this._sub.add(
      this.tasks$.pipe<Task[]>(
        distinctUntilChanged<Task[]>(R.equals)
      ).subscribe((tasks: Task[]) => {
        this.tasksInputs = tasks.map((task) => this.mapTaskItemToTaskRealizationItem(task));
      })
    )
  }
  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  toggleCheckboxState(e: Event, task: BaseTaskRealizationItem) {
    e.preventDefault();
    const updatedTask: Partial<Task>= {
      id: task.id,
      completed: !task.completed
    }
    this.store.dispatch(TasksActions.updateTaskRequest({task: updatedTask}));
  }

  mapTaskItemToTaskRealizationItem(task: Task): TaskRealizationItem {
    switch(task.type) {
      case TaskType.CYCLIC:
      case TaskType.PROGRESSIVE:
        return {
          id: task.id,
          title: task.title,
          completed: task.completed,
          type: task.type,
          taskCompletions: task?.taskCompletions || [],
          verification_method: task.verification_method,
          period: {
            duration: task.iterationDuration,
            currentPeriodEnd: this.computeDates(task.iterationDuration)[1].toJSDate(),
            currentPeriodStart: this.computeDates(task.iterationDuration)[0].toJSDate(),
          },
        } as CyclicTaskRealizationItem | ProgressiveTaskRealizationItem
      default:
        return {
          id: task.id,
          title: task.title,
          completed: task.completed,
          type: task.type,
          verification_method: task.verification_method,
          value: task.value,
        } as SingleTaskRealization;
    }
  }

  getCyclicTasksPerPeriod(tasks: Array<CyclicTaskItemRealization>, period: number): Array<CyclicTaskItemRealization> {
    if(!tasks || !period) {
      return [];
    }
    const [periodBegin, periodEnd] = this.computeDates(period);
    const tasksPerPeriod = tasks.map((task, index) => ({...task, index})).filter(({dueDate}) => {
      const taskDate = DateTime.fromISO(`${dueDate}`);
      return taskDate > periodBegin && taskDate <= periodEnd;
    });
    return (tasksPerPeriod || []) as Array<CyclicTaskItemRealization>;
  }

  getProgressiveTasksPerPeriod(tasks: Array<ProgressiveTaskItemRealization>, period: number): Array<ProgressiveTaskItemRealization> {
    if(!tasks || !period) {
      return [];
    }
    const [periodBegin, periodEnd] = this.computeDates(period);
    const tasksPerPeriod = tasks.map((task, index) => ({...task, index})).filter(({dueDate}) => {
      const taskDate = DateTime.fromISO(`${dueDate}`);
      return taskDate > periodBegin && taskDate <= periodEnd;
    });
    return (tasksPerPeriod || []) as Array<ProgressiveTaskItemRealization>
  }

  private computeDates = (period: number): [beginningDate: DateTime, endDate: DateTime] => {
    const today = DateTime.now();

    switch(+period) {
      case MONTH_DURATION:
        const monthStart = today.startOf('month');
        const monthEnd = today.endOf('month');
        return [monthStart, monthEnd];
      case YEAR_DURATION:
        const yearStart = today.startOf('year');
        const yearEnd = today.endOf('year');
        return [yearStart, yearEnd];
      case WEEK_DURATION:
        const weekStart = today.startOf('week');
        const weekEnd = today.endOf('week')
        return [weekStart, weekEnd];
      default:
        throw new Error('Invalid period');
    }
  }
}
