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

  async create(data: Partial<ISkillCategoryDocument>): Promise<ISkillCategoryDocument> {
    const existing = await SkillCategoryModel.findOne({ title: data.title });
    if (existing) {
      const { title, ...updateData } = data;
      return (await SkillCategoryModel.findByIdAndUpdate(existing._id, updateData, { new: true }))!;
    }
    return skillsRepository.create(data);
  }

  async reorder(ids: string[]): Promise<void> {
    await reorderDocuments(SkillCategoryModel, ids);
  }
}

export const skillsService = new SkillsService();
