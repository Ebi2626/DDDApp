export const WEEK_DURATION = 604800000;
export const MONTH_DURATION = 4 * WEEK_DURATION;
export const YEAR_DURATION = 12 * MONTH_DURATION;

export enum TaskType {
  'SINGLE',
  'CYCLIC',
  'PROGRESSIVE'
}

export enum TaskTypeNames {
  'jednorazowe',
  'cykliczne',
  'progresywne'
}

export const TaskTypeNameMap: Record<number, string> = Object.keys(TaskType).map((_, i) => TaskTypeNames[i]);

export enum TaskRealizationConfirmation {
  'CHECKBOX',
  'TEXT',
  'NUMBER',
  'FILE'
}

export enum TaskRealizationConfirmationNames {
  'kliknięcie',
  'wprowadzenie tekstu',
  'wprowadzenie liczby',
  'zamieszczenie pliku'
}

export const TaskRealizationConfirmationNameMap: Record<number, string> = Object.keys(TaskRealizationConfirmation).map((_, i) => TaskRealizationConfirmationNames[i]);


export enum IterationDuration {
  'WEEK' = WEEK_DURATION,
  'MONTH' = MONTH_DURATION,
  'YEAR' = YEAR_DURATION
}

export interface CyclicTaskItemRealization {
  dueDate: Date;
  completed: boolean;
}

export interface ProgressivTaskItemRealization extends CyclicTaskItemRealization {
  value: number;
}

export interface BaseTask {
  id: string;
  targetId: string;
  title: string;
  description: string;
  type: TaskType;
  deadline: Date;
  verification_method: TaskRealizationConfirmation;
  creationDate: Date;
  completed: boolean;
  category?: string;
  reward?: string;
  punishment?: string;
}

export interface SingleTask extends BaseTask {
  isChecked: boolean;
  completionDate?: Date;
  type: TaskType.SINGLE
}

export interface CyclicTask extends BaseTask {
  taskCompletions: CyclicTaskItemRealization[];
  iterationDuration: IterationDuration;
  tasksPerIteration: number;
  type: TaskType.CYCLIC
}

export interface ProgressiveTask extends BaseTask {
  verification_method: TaskRealizationConfirmation.NUMBER
  initialTaskValue: number;
  progressStep: number;
  taskCompletions: ProgressivTaskItemRealization[];
  iterationDuration: IterationDuration;
  tasksPerIteration: number;
  intervalProgressStepDuration: number; //ms
  type: TaskType.PROGRESSIVE
}

export type Task = SingleTask | CyclicTask | ProgressiveTask;

export const mockTasks: Task[] = [
  {
    id: '1',
    targetId: '123',
    creationDate: '2023-03-15T00:00:00.000Z' as unknown as Date,
    deadline: '2023-03-30T00:00:00.000Z' as unknown as Date,
    title: 'Przebiec dystans półmaratonu',
    description: 'Przebiec dystans półmaratonu aby przekonać się, czy mam odpowiednią kondycję fizyczną.',
    isChecked: false,
    completed: false,
    type: 0,
    verification_method: 0
  },
  {
    id: '2',
    targetId: '123',
    creationDate: '2023-03-15T00:00:00.000Z' as unknown as Date,
    deadline: '2023-03-30T00:00:00.000Z' as unknown as Date,
    title: '5x w tygodniu biegać 5km',
    description: 'Wprowadzić rutynę biegania krótkich dystansów codziennie, by przygotować organizm do wysiłku.',
    completed: false,
    type: 1,
    verification_method: 0,
    iterationDuration: 604800000,
    tasksPerIteration: 5,
    taskCompletions: []
  }
]