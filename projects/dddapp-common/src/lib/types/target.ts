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
  categories: string[];
  reward?: string;
  punishment?: string;
  _progress?: number;
}
