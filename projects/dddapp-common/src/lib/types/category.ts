export interface Category {
  id: string;
  title: string;
  descritpion: string;
  color: string;
  targets: string[];
  tasks: string[];
  isDefault: boolean;
}

export interface NewCategory {
  color: string;
  description: string;
  title: string;
}

export interface NewCategoryForRequest extends Omit<Category, 'id'> {}
