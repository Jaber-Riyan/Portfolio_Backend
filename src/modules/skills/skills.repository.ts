import { SkillCategoryModel } from './skills.model';
import { ISkillCategoryDocument } from './skills.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class SkillsRepository extends BaseRepository<ISkillCategoryDocument> {
  constructor() { super(SkillCategoryModel); }
}

export const skillsRepository = new SkillsRepository();
