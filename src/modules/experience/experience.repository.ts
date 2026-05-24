import { ExperienceModel } from './experience.model';
import { IExperienceDocument } from './experience.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class ExperienceRepository extends BaseRepository<IExperienceDocument> {
  constructor() { super(ExperienceModel); }
}

export const experienceRepository = new ExperienceRepository();
