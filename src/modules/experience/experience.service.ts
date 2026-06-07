import { experienceRepository } from './experience.repository';
import { IExperienceDocument } from './experience.interface';
import { BaseService } from '../../shared/helpers/baseService';
import { knowledgeService } from '../knowledge/knowledge.service';
import { Types, UpdateQuery } from 'mongoose';
import { logger } from '../../shared/logger/logger';

class ExperienceService extends BaseService<IExperienceDocument, typeof experienceRepository> {
  constructor() { super(experienceRepository); }

  async getAll(): Promise<IExperienceDocument[]> {
    return experienceRepository.findAll({}, { sortOrder: 1 });
  }

  async create(data: Partial<IExperienceDocument>): Promise<IExperienceDocument> {
    const existing = await experienceRepository.findOne({ role: data.role, company: data.company });
    if (existing) {
      const updated = (await experienceRepository.updateById(existing._id.toString(), data))!;
      this.syncKnowledge(updated._id as Types.ObjectId);
      return updated;
    }
    const created = await experienceRepository.create(data);
    this.syncKnowledge(created._id as Types.ObjectId);
    return created;
  }

  async update(id: string, data: UpdateQuery<IExperienceDocument>): Promise<IExperienceDocument> {
    const updated = await super.update(id, data);
    this.syncKnowledge(updated._id as Types.ObjectId);
    return updated;
  }

  async delete(id: string): Promise<IExperienceDocument> {
    const deleted = await super.delete(id);
    knowledgeService
      .deleteChunks('experience', deleted._id as Types.ObjectId)
      .catch((err) => logger.warn('[Knowledge] Failed to delete experience chunk:', err));
    return deleted;
  }

  private syncKnowledge(id: Types.ObjectId): void {
    knowledgeService
      .indexExperienceById(id)
      .catch((err) => logger.warn('[Knowledge] Failed to index experience:', err));
  }
}

export const experienceService = new ExperienceService();
