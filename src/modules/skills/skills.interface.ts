import { Document } from 'mongoose';

export interface ISkillItem {
  name: string;
  icon: string;
}

export interface ISkillCategory {
  title: string;
  sortOrder: number;
  items: ISkillItem[];
}

export interface ISkillCategoryDocument extends ISkillCategory, Document {}
