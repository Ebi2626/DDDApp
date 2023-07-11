import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChartData, ChartDataset } from 'chart.js';
import { CyclicTask, ProgressiveTask, Target, TargetStateClass, Task, TaskType } from 'dddapp-common';
import { TargetsService } from '../../targets/services/targets.service';
import { DateTime } from "luxon";
import { BaseLineDatasetContent } from '../models/dashboard.model';
import { TargetProgressService } from '../../targets/services/targetProgress.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private targetsService: TargetsService,
    private targetProgressService: TargetProgressService
  ) { }

  getTargetsDatasetsProgress(targets: Target[], tasks: Task[]): ChartData<'bar'> {
    const datasets: ChartDataset<'bar'>[] = targets.map((target) => {
      const targetProgress = +this.targetProgressService.getTargetProgress(target, tasks);
      const label = target.title;
      return {
        data: [ +(targetProgress * 100).toFixed(2) ],
        label,
      }
    });
    return {
      labels: [ 'Realizacja celów' ],
      datasets
    }
  }

  getTargetsDatasetsPerState(targets: Target[], tasks: Task[]): ChartData<'bar'>  {
    const validatedTargets = targets.map((target) => this.targetsService.validateTarget(target, tasks));
    const successfullTargets = validatedTargets.filter((targetState: TargetStateClass) => targetState === TargetStateClass.SUCCESS).length;
    const failedTargets = validatedTargets.filter((targetState: TargetStateClass) => targetState === TargetStateClass.FAILED).length;
    const inProgressTargets = validatedTargets.filter((targetState: TargetStateClass) => targetState === TargetStateClass.IN_PROGRESS).length;

    return {
      labels: [ 'Cele po stanie' ],
      datasets: [
        { data: [ successfullTargets ], label: 'Zrealizowane' },
        { data: [ inProgressTargets ], label: 'W trakcie'},
        { data: [ failedTargets ], label: 'Nie zrealizowane'},
      ]
    }
  }

  private getTaskCompletionsPerDate(task: Task, beginOfMonth: DateTime): number {
    const endOfCurrentMonthDate = beginOfMonth.endOf('month');

    switch(+task.type){
      case TaskType.SINGLE:
        if(!task.completed) {
          return 0
        }
        const taskCompletionDate = task.completionDate ? DateTime.fromISO(`${task.completionDate}`) : false;
        return taskCompletionDate
        ? (taskCompletionDate > beginOfMonth && taskCompletionDate <= endOfCurrentMonthDate ? 1 : 0)
        : 0;
      case TaskType.CYCLIC:
      case TaskType.PROGRESSIVE:
        return (task as CyclicTask | ProgressiveTask).taskCompletions.filter(({dueDate, value}) => {
          const taskDate = DateTime.fromISO(`${dueDate}`);
          return  taskDate > beginOfMonth && taskDate <= endOfCurrentMonthDate && value;
        }).length;
      default:
        throw new Error('Wrong task type');
    }
  }

  getTargetsDatasetsProgressPerMonth(targets: Target[], tasks: Task[]): ChartData<'line'> {
    const now = DateTime.now().setLocale('pl');
    const previousYear = now.minus({years: 1});
    const beginningOfMonth = previousYear.startOf('month');
    const months: { date: DateTime, label: string}[] = Array.from({length: 13}).map((_, i) => {
        const month = beginningOfMonth.plus({months: i}).startOf('month');
        return {
          date: month,
          label: month.toFormat('yyyy LLLL'),
        }
      }
    );
    const datasets = targets.map((target, i) => {
      const targetsTasks = tasks.filter(({id}) => target.tasks.includes(id));
      return {
        data: months.map(({date}) =>
          targetsTasks.reduce((acc: number, curr: Task) => {
            const currentMonthRealizations = this.getTaskCompletionsPerDate(curr, date);
            return acc + currentMonthRealizations;
          }, 0)
        ),
        label: target.title,
        ...BaseLineDatasetContent,
      }
    })

    return {
      labels: [
        ...months.map(({label}) => label),
      ],
      datasets,
    }
  }

  getTasksDatasetsPerState(tasks: Task[]): ChartData<'bar'> {
    const now = new Date().getTime();
    const finishedTasks = tasks.filter(({completed}) => completed).length;
    const inProgressTasks = tasks.filter(({completed, deadline}) => !completed && new Date(deadline).getTime() > now).length;
    const failedTasks = tasks.filter(({completed, deadline}) => !completed && deadline && now >= new Date(deadline).getTime()).length;

    return {
      labels: [ 'Zadania po stanie' ],
      datasets: [
        { data: [ finishedTasks ], label: 'Zrealizowane' },
        { data: [ inProgressTasks ], label: 'W trakcie'},
        { data: [ failedTasks ], label: 'Nie zrealizowane '}

      ]
    }
  }

  getTasksDatasetsPerType(tasks: Task[]): ChartData<'bar'> {
    const singleTasks = tasks.filter(({type}) => type === TaskType.SINGLE).length;
    const cyclicTask = tasks.filter(({type}) => type === TaskType.CYCLIC).length;
    const progressive = tasks.filter(({type}) => type === TaskType.PROGRESSIVE).length;

    return {
      labels: [ 'Zadania po typie' ],
      datasets: [
        { data: [ singleTasks ], label: 'Jednorazowe' },
        { data: [ cyclicTask ], label: 'Cykliczne'},
        { data: [ progressive ], label: 'Progresywne'}

      ]
    }
  }

  getTasksToFillInNextPeriod(tasks: Task[]): Task[] {
    const now = DateTime.now();
    const tasksToFillInNextPeriod = tasks
    .filter((task) => !task.completed)
    .map((task) => {
      switch(+task.type){
        case TaskType.SINGLE:
          return DateTime.fromISO(`${task.deadline}`) > now ? task : null
        case TaskType.CYCLIC:
          const cyclicTask = task as CyclicTask;
          cyclicTask.taskCompletions
          return {} as Task;
        case TaskType.PROGRESSIVE:
          return {} as Task;
        default:
          throw new Error('Wrong task type');
      }
    })
    .filter((task) => task !== null) as Task[];
    return tasksToFillInNextPeriod;
  }

}
