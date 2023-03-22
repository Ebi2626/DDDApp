import { mockTasks, Task } from "../../tasks/models/tasks.models";

export enum TargetWage {
  'Opcjonalny',
  'Dodatkowy',
  'Standardowy',
  'Istotny',
  'Kluczowy'
}

export const TargetWageNames: Record<number, string>[] = Object.keys(TargetWage)
  .map((name) => name)
  .slice(
    Math.ceil(Object.keys(TargetWage).length / 2)
  );

export enum TargetStateClass {
  'IN_PROGRESS' = 'inProgress',
  'FAILED' = 'failed',
  'SUCCESS' = 'success'
}

export interface Target {
  id: string;
  title: string;
  motivation: string;
  description: string;
  deadline: Date | string;
  tasks: string[];
  wage: TargetWage;
  creationDate: Date | string;
  category?: string;
  reward?: string;
  punishment?: string;
  _progress?: number;
}

export const mockTargets: Target[] = [
  {
    id: '123',
    title: 'Przebiec maraton',
    motivation: 'Udowodnienie sobie, że mimo upływających lat nadal jestem w formie.',
    description: 'Należy przygotować się odpowiednio i przebiec pełen dystans maratornu.',
    deadline: new Date('2023-09-31'),
    creationDate: new Date('2023-03-15'),
    tasks: mockTasks.map((task) => task.id),
    wage: TargetWage.Istotny,
  },
  {
    id: '124',
    title: 'Nauczyć się angielskiego na C1',
    motivation: 'Przygotowane do pracy dla międzynarodowych korporacji.',
    description: 'Opanowanie języka angielskiego na wysokim poziomie gwarantujące wysoką jakość komunikacji.',
    deadline: new Date('2023-12-31'),
    creationDate: new Date('2023-03-15'),
    tasks: [],
    wage: TargetWage.Kluczowy,
  },
]