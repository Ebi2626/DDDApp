import { Injectable } from '@angular/core';
import { Target } from '../models/targets.model';
import { Task, TaskType } from '../../tasks/models/tasks.models';
import {
  CyclicTask,
  CyclicTaskItemRealization,
  ProgressiveTask,
  ProgressivTaskItemRealization,
  SingleTask
} from '../../tasks/models/tasks.models';

@Injectable({
  providedIn: 'root'
})
export class TargetProgressService {

  getTargetProgress(target: Target, tasks: Task[]): number {

    const targetTasks = tasks.filter((task) => target.tasks.includes(task.id))

    const tasksQuantity = targetTasks?.length || 0;

    if (tasksQuantity === 0) {
      return 0;
    }

    const taskFactor = 1 / tasksQuantity;


    const sumOfProgress = targetTasks.reduce<number>((acc: number, curr: Task) => {
      if (curr.type === TaskType.SINGLE) {
        return acc + this.countSingleTaskProgress(curr) * taskFactor;
      }
      return acc + this.countCyclicTaskProgress(curr) * taskFactor;
    }, 0);


    return sumOfProgress;
  }


  private countSingleTaskProgress(task: SingleTask): number {
    return task.completed ? 1 : 0;
  }

  private countCyclicTaskProgress(task: CyclicTask | ProgressiveTask): number {
    const taskItemsQuantity: number = task.taskCompletions?.length || 0;
    if (taskItemsQuantity === 0) {
      return 0;
    }
    const completedItemsQuantity: number = task.taskCompletions.filter(({ completed }: CyclicTaskItemRealization | ProgressivTaskItemRealization) => completed).length;

    return completedItemsQuantity / taskItemsQuantity;
  }
}