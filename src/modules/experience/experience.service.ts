import { experienceRepository } from './experience.repository';
import { IExperienceDocument } from './experience.interface';
import { BaseService } from '../../shared/helpers/baseService';

class ExperienceService extends BaseService<IExperienceDocument, typeof experienceRepository> {
  constructor() { super(experienceRepository); }

  async getAll(): Promise<IExperienceDocument[]> {
    return experienceRepository.findAll({}, { sortOrder: 1 });
  }
}

export const experienceService = new ExperienceService();
