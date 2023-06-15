import { Task } from './Task';
import { Reward } from './Reward';
import { Punishment } from './Punishment';

export interface Target {
  id: string;
  title: string;
  from: Date;
  to: Date;
  purpose: string;
  progress: number;
  tasks: Array<Task>;
  rewards?: Array<Reward>;
  punishments?: Array<Punishment>;
}

// api/target :: Target<Array>
// api/target/{id} :: Target
// api/target/{id}/task :: Task<Array>
// api/target/{id}/task/{id} :: Task
// api/target/{id}/reward :: Reward<Array>
// api/target/{id}/reward/{id} :: Reward
// api/target/{id}/punishment :: Punishment<Array>
// api/target/{id}/punishment/{id} :: Punishment
