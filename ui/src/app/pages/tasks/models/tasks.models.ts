export const WEEK_DURATION = 604800000;
export const MONTH_DURATION = 4 * WEEK_DURATION;
export const YEAR_DURATION = 12 * MONTH_DURATION;

export enum TaskType {
  'SINGLE',
  'CYCLIC',
  'PROGRESSIVE'
}

export enum TaskRealizationConfirmation {
  'CHECKBOX',
  'TEXT',
  'NUMBER',
  'FILE'
}

export enum IterationDuration {
  'WEEK' = WEEK_DURATION,
  'MONTH' = MONTH_DURATION,
  'YEAR' = YEAR_DURATION
}

export interface CyclicTaskItemRealization {
  date: Date;
  completed: boolean;
}

export interface ProgressivTaskItemRealization {
  date: Date;
  value: number;
  completed: boolean;
}

export interface BaseTask {
  id: string;
  targetId: string;
  instanceId: string;
  title: string;
  description: string;
  type: TaskType;
  deadline: Date;
  verification_method: TaskRealizationConfirmation;
  creationDate: Date;
  isCompleted: boolean;
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
  taskCompletions?: ProgressivTaskItemRealization[];
  iterationDuration: IterationDuration;
  tasksPerIteration: number;
  intervalProgressStepDuration: number; //ms
  type: TaskType.PROGRESSIVE
}

export type Task = SingleTask | CyclicTask | ProgressiveTask;

export type TaskTemplate = Omit<Task, 'targetId' | 'creationDate' | 'instanceId' | 'isCompleted'>;

export const mockTasks: Task[] = [
  {
    id: '1',
    instanceId: '1',
    targetId: '123',
    creationDate: new Date('2023-03-15'),
    deadline: new Date('2023-03-30'),
    title: 'Przebiec dystans półmaratonu',
    description: 'Przebiec dystans półmaratonu aby przekonać się, czy mam odpowiednią kondycję fizyczną.',
    isChecked: false,
    isCompleted: false,
    type: TaskType.SINGLE,
    verification_method: TaskRealizationConfirmation.CHECKBOX,
  },
  {
    id: '2',
    instanceId: '2',
    targetId: '123',
    creationDate: new Date('2023-03-15'),
    deadline: new Date('2023-03-30'),
    title: '5x w tygodniu biegać 5km',
    description: 'Wprowadzić rutynę biegania krótkich dystansów codziennie, by przygotować organizm do wysiłku.',
    isCompleted: false,
    type: TaskType.CYCLIC,
    verification_method: TaskRealizationConfirmation.CHECKBOX,
    iterationDuration: IterationDuration.WEEK,
    tasksPerIteration: 5,
    taskCompletions: [],
  },
]