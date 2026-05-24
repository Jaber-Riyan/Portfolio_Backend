import { ISkillItem } from './skills.interface';

export interface CreateSkillCategoryDto {
  title: string;
  sortOrder?: number;
  items?: ISkillItem[];
}

export interface UpdateSkillCategoryDto extends Partial<CreateSkillCategoryDto> {}

export interface ReorderDto {
  ids: string[];
}
