import { experienceRepository } from './experience.repository';
import { IExperienceDocument } from './experience.interface';
import { BaseService } from '../../shared/helpers/baseService';
import { UpdateQuery } from 'mongoose';

class ExperienceService extends BaseService<IExperienceDocument, typeof experienceRepository> {
  constructor() { super(experienceRepository); }

  async getAll(): Promise<IExperienceDocument[]> {
    return experienceRepository.findAll({}, { sortOrder: 1 });
  }

  async create(data: Partial<IExperienceDocument>): Promise<IExperienceDocument> {
    const existing = await experienceRepository.findOne({ role: data.role, company: data.company });
    if (existing) {
      return (await experienceRepository.updateById(existing._id.toString(), data))!;
    }
    return experienceRepository.create(data);
  }

  async update(id: string, data: UpdateQuery<IExperienceDocument>): Promise<IExperienceDocument> {
    return super.update(id, data);
  }
}

export const experienceService = new ExperienceService();
