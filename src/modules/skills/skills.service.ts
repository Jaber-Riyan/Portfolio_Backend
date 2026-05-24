import { skillsRepository } from './skills.repository';
import { ISkillCategoryDocument } from './skills.interface';
import { BaseService } from '../../shared/helpers/baseService';
import { reorderDocuments } from '../../shared/helpers/reorder';
import { SkillCategoryModel } from './skills.model';

class SkillsService extends BaseService<ISkillCategoryDocument, typeof skillsRepository> {
  constructor() { super(skillsRepository); }

  async getAll(): Promise<ISkillCategoryDocument[]> {
    return skillsRepository.findAll({}, { sortOrder: 1 });
  }

  async reorder(ids: string[]): Promise<void> {
    await reorderDocuments(SkillCategoryModel, ids);
  }
}

export const skillsService = new SkillsService();
