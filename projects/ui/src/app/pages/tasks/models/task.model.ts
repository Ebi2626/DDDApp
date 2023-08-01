import { Task } from "dddapp-common";

export interface NewTaskForRequest extends Omit<Task, 'id'>{}

export interface TaskForm extends Omit<NewTaskForRequest, 'categories'> {
  categories: boolean[];
}
