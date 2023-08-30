import { Category, Target, Task } from 'dddapp-common';

export class CreateDataDto {
  Targets: Target[];
  Categories: Category[];
  Tasks: Task[];
}
