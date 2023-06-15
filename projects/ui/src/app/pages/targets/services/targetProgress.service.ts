import { Injectable } from '@angular/core';
import {
  Task,
  Target,
  TaskRealizationConfirmation,
  TaskType,
  CyclicTask,
  ProgressiveTask,
  SingleTask
} from 'dddapp-common';

@Injectable({
  providedIn: 'root'
})
export class TargetProgressService {

  getTargetProgress(target: Target, tasks: Task[]): number {

    const targetTasks = tasks?.filter((task) => target.tasks?.includes(task.id)) || [];

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
    let completedItemsQuantity: number;
    if(task.type === TaskType.PROGRESSIVE) {
      completedItemsQuantity = task.taskCompletions.filter(({value, goal}) => value && value > goal).length;
    } else {
      switch(+task.verification_method) {
        case TaskRealizationConfirmation.CHECKBOX:
          completedItemsQuantity = task.taskCompletions.filter(({value}) => value).length;
        break;
        case TaskRealizationConfirmation.FILE:
          completedItemsQuantity = task.taskCompletions.filter(({value}) => value).length;
        break;
        case TaskRealizationConfirmation.NUMBER:
          completedItemsQuantity = task.taskCompletions.filter(({value}) => value !== null).length;
        break;
        case TaskRealizationConfirmation.TEXT:
          completedItemsQuantity = task.taskCompletions.filter(({value}) => (value as string)?.length).length;
        break;
        default:
          throw new Error('Unknown verification method');
      }
    }
    return completedItemsQuantity / taskItemsQuantity;
  }
}
