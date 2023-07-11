import { Category } from 'dddapp-common';

export class CreateCategoryDto implements Category {
  id: string;
  title: string;
  descritpion: string;
  color: string;
  targets: string[];
  tasks: string[];
}
