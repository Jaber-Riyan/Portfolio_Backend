import { educationRepository } from './education.repository';
import { IEducationDocument } from './education.interface';
import { BaseService } from '../../shared/helpers/baseService';

class EducationService extends BaseService<IEducationDocument, typeof educationRepository> {
  constructor() { super(educationRepository); }

  async getAll(): Promise<IEducationDocument[]> {
    return educationRepository.findAll({}, { sortOrder: 1 });
  }
}

export const educationService = new EducationService();
