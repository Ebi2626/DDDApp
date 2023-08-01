import { Target, TargetWage } from 'dddapp-common';

export class CreateTargetDto implements Target {
  id: string;
  title: string;
  motivation: string;
  description: string;
  deadline: string | Date;
  tasks: string[];
  wage: TargetWage;
  creationDate: string | Date;
  categories: string[];
  reward?: string;
  punishment?: string;
  _progress?: number;
}
