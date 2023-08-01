export const WEEK_DURATION = 604800000;
export const MONTH_DURATION = 4 * WEEK_DURATION;
export const YEAR_DURATION = 12 * MONTH_DURATION;

export enum TaskPeriod {
  WEEK_DURATION,
  MONTH_DURATION,
  YEAR_DURATION,
}

export enum TaskType {
  'SINGLE',
  'CYCLIC',
  'PROGRESSIVE',
}

export enum TaskTypeNames {
  'jednorazowe',
  'cykliczne',
  'progresywne',
}

export const TaskTypeNameMap: Record<number, string> = Object.keys(
  TaskType
).map((_, i) => TaskTypeNames[i]);

export interface Option {
  value: number;
  name: string;
}

export enum FileType {
  'IMAGE',
  'TEXT',
}

export const GRAPHIC_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'webd',
  'tiff',
  'gif',
  'apng',
  'avif',
];

export enum TaskRealizationConfirmation {
  'CHECKBOX',
  'TEXT',
  'NUMBER',
  'FILE',
}

export enum TaskRealizationConfirmationNames {
  'kliknięcie',
  'wprowadzenie tekstu',
  'wprowadzenie liczby',
  'zamieszczenie pliku',
}

export const TaskRealizationConfirmationNameMap: Record<number, string> =
  Object.keys(TaskRealizationConfirmation).map(
    (_, i) => TaskRealizationConfirmationNames[i]
  );

export type ITERATION_LENGTH = 'WEEK' | 'MONTH' | 'YEAR';

type IterationDurationInterface = {
  [k in ITERATION_LENGTH]: number;
};
type IterationDurationNamesInterface = {
  [k in ITERATION_LENGTH]: string;
};

export const IterationDuration: IterationDurationInterface = {
  WEEK: WEEK_DURATION,
  MONTH: MONTH_DURATION,
  YEAR: YEAR_DURATION,
};

export const IterationDurationNames: IterationDurationNamesInterface = {
  WEEK: 'tydzień',
  MONTH: 'miesiąc',
  YEAR: 'rok',
};

export interface BaseCyclicTaskItemRealization {
  dueDate: Date;
  index?: number;
}

export interface CyclicTaskItemRealizationCheckbox
  extends BaseCyclicTaskItemRealization {
  value: boolean;
}

export interface CyclicTaskItemRealizationText
  extends BaseCyclicTaskItemRealization {
  value: string;
}

export interface CyclicTaskItemRealizationFile
  extends BaseCyclicTaskItemRealization {
  value: TaskFile;
}

export interface CyclicTaskItemRealizationNumber
  extends BaseCyclicTaskItemRealization {
  value: number | null;
}

export interface ProgressiveTaskItemRealization
  extends BaseCyclicTaskItemRealization {
  goal: number;
  value: number | null;
}

export type CyclicTaskItemRealization =
  | CyclicTaskItemRealizationCheckbox
  | CyclicTaskItemRealizationText
  | CyclicTaskItemRealizationFile
  | CyclicTaskItemRealizationNumber;

export interface BaseTask {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  deadline: Date;
  verification_method: TaskRealizationConfirmation;
  creationDate: Date;
  completed: boolean;
  completionDate?: Date;
  categories: string[];
  reward?: string;
  punishment?: string;
}0

export interface SingleTask extends BaseTask {
  completionDate?: Date;
  type: TaskType.SINGLE;
  value: any;
}

export interface CyclicTask extends BaseTask {
  taskCompletions: CyclicTaskItemRealization[];
  iterationDuration: number;
  tasksPerIteration: number;
  type: TaskType.CYCLIC;
}

export interface ProgressiveTask extends BaseTask {
  verification_method: TaskRealizationConfirmation.NUMBER;
  initialTaskValue: number;
  progressStep: number;
  taskCompletions: ProgressiveTaskItemRealization[];
  iterationDuration: number;
  tasksPerIteration: number;
  intervalProgressStepDuration: number; //ms
  type: TaskType.PROGRESSIVE;
}

export type Task = SingleTask | CyclicTask | ProgressiveTask;

export interface TaskFile {
  fileName: string;
  originalName: string;
  size: number;
  taskId: string;
  userId: string;
  taskCompletionIndex?: number;
}

export interface NewTaskForRequest extends Omit<Task, 'id'>{}
