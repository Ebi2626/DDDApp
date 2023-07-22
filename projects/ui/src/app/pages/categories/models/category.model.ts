import { Category } from "dddapp-common";

export interface NewCategory {
  color: string;
  description: string;
  title: string;
}

export interface NewCategoryForRequest extends Omit<Category, 'id'> {}

