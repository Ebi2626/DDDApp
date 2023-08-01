import {
  SingleTask,
  CyclicTask,
  ProgressiveTask,
  TaskRealizationConfirmation,
  CyclicTaskItemRealization,
  ProgressiveTaskItemRealization,
} from 'dddapp-common';
import { IntersectionType } from '@nestjs/swagger';

class SingleTaskDto implements SingleTask {
  completionDate?: Date;
  type: any;
  value: any;
  id: string;
  title: string;
  description: string;
  deadline: Date;
  verification_method: TaskRealizationConfirmation;
  creationDate: Date;
  completed: boolean;
  categories: string[];
  reward?: string;
  punishment?: string;
}

class CyclicTaskDto implements CyclicTask {
  taskCompletions: CyclicTaskItemRealization[];
  iterationDuration: number;
  tasksPerIteration: number;
  type: any;
  id: string;
  title: string;
  description: string;
  deadline: Date;
  verification_method: TaskRealizationConfirmation;
  creationDate: Date;
  completed: boolean;
  completionDate?: Date;
  categories: string[];
  reward?: string;
  punishment?: string;
}

class ProgressiveTaskDto implements ProgressiveTask {
  verification_method: TaskRealizationConfirmation.NUMBER;
  initialTaskValue: number;
  progressStep: number;
  taskCompletions: ProgressiveTaskItemRealization[];
  iterationDuration: number;
  tasksPerIteration: number;
  intervalProgressStepDuration: number;
  type: any;
  id: string;
  title: string;
  description: string;
  deadline: Date;
  creationDate: Date;
  completed: boolean;
  completionDate?: Date;
  categories: string[];
  reward?: string;
  punishment?: string;
}

export class CreateTaskDto extends IntersectionType(
  SingleTaskDto,
  CyclicTaskDto,
  ProgressiveTaskDto,
) {}
