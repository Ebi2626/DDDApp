import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { Target, Task } from 'dddapp-common';
import { BehaviorSubject, Subject, Subscription, combineLatest, distinctUntilChanged } from 'rxjs';
import { ChartData } from 'chart.js';
import * as R from 'ramda';
import { EmptyTargetDatasetsPerState, EmptyTargetDatasetsProgress, EmptyTargetsProgress, EmptyTasksDatasetsPerType } from '../../models/dashboard.model';

@Component({
  selector: 'dddapp-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardStatisticsComponent implements OnDestroy {

  private sub: Subscription = new Subscription();

  private _targets: Target[] = [];
  @Input()
  set targets(newTargets: Target[]) {
    this.targets$.next(newTargets);
    this._targets = newTargets;
  }
  get targets(): Target[] {
    return this._targets;
  }
  targets$: Subject<Target[]> = new Subject();

  private _tasks: Task[] = [];
  @Input()
  set tasks(newTasks: Task[]) {
    this.tasks$.next(newTasks);
    this._tasks = newTasks;
  }
  get tasks(): Task[] {
    return this._tasks;
  }
  tasks$: Subject<Task[]> = new Subject();

  public targetDatasetsPerState$: BehaviorSubject<ChartData<"bar">> = new BehaviorSubject<ChartData<'bar'>>(EmptyTargetDatasetsPerState as ChartData<'bar'>);
  public tasksDatasetsPerState$: BehaviorSubject<ChartData<"bar">> = new BehaviorSubject<ChartData<'bar'>>(EmptyTargetDatasetsPerState as ChartData<'bar'>);
  public targetDatasetsProgressPerMonth$: BehaviorSubject<ChartData<"line">> = new BehaviorSubject<ChartData<'line'>>(EmptyTargetsProgress as ChartData<'line'>)
  public tasksDatasetsPerType$: BehaviorSubject<ChartData<"bar">> = new BehaviorSubject<ChartData<"bar">>(EmptyTasksDatasetsPerType as ChartData<'bar'>);
  public targetDatasetsProgress$: BehaviorSubject<ChartData<"bar">> = new BehaviorSubject<ChartData<'bar'>>(EmptyTargetDatasetsProgress as ChartData<'bar'>)


  constructor( private dashboardService: DashboardService) {
    this.sub.add(
      combineLatest([
        this.targets$,
        this.tasks$
      ])
      .pipe(
        distinctUntilChanged<[Target[], Task[]]>(R.equals)
      )
      .subscribe(([targets, tasks]) => {
        this.targetDatasetsPerState$.next(this.dashboardService.getTargetsDatasetsPerState(targets, tasks) || EmptyTargetDatasetsPerState as ChartData<'bar'>)
      })
    );

    this.sub.add(
      this.tasks$
      .pipe(
        distinctUntilChanged<Task[]>(R.equals)
      )
      .subscribe((tasks) => {
        this.tasksDatasetsPerState$.next(this.dashboardService.getTasksDatasetsPerState(tasks) || EmptyTargetDatasetsPerState as ChartData<'bar'>)
      })
    );

    this.sub.add(
      combineLatest([
        this.targets$,
        this.tasks$
      ])
      .pipe(
        distinctUntilChanged<[Target[], Task[]]>(R.equals)
      )
      .subscribe(([targets, tasks]) => {
        this.targetDatasetsProgressPerMonth$.next(this.dashboardService.getTargetsDatasetsProgressPerMonth(targets, tasks) || EmptyTargetsProgress as ChartData<'line'>)
      })
    );

    this.sub.add(
      this.tasks$
      .pipe(
        distinctUntilChanged<Task[]>(R.equals)
      )
      .subscribe((tasks) => {
        this.tasksDatasetsPerType$.next(this.dashboardService.getTasksDatasetsPerType(tasks));
      })
    );

    this.sub.add(
      combineLatest([
        this.targets$,
        this.tasks$
      ])
      .pipe(
        distinctUntilChanged<[Target[], Task[]]>(R.equals)
      )
      .subscribe(([targets, tasks]) => {
        this.targetDatasetsProgress$.next(this.dashboardService.getTargetsDatasetsProgress(targets, tasks) || EmptyTargetDatasetsProgress as ChartData<'bar'>)
      })
    );
  }

  ngOnDestroy() {
    this?.sub.unsubscribe();
  }
}
