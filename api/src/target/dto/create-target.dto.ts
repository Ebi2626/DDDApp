import { Task } from '../../interfaces/Task';
import { Reward } from '../../interfaces/Reward';
import { Punishment } from '../../interfaces/Punishment';
import { Target } from 'src/interfaces/Target';

export class CreateTargetDto {
  id: string;
  title: string;
  from?: Date;
  to?: Date;
  purpose?: string;
  progress?: number;
  tasks?: Task[];
  rewards?: Reward[];
  punishments?: Punishment[];
}
