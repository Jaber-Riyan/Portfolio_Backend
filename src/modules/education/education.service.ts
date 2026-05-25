import { educationRepository } from './education.repository';
import { IEducationDocument } from './education.interface';
import { BaseService } from '../../shared/helpers/baseService';

class EducationService extends BaseService<IEducationDocument, typeof educationRepository> {
  constructor() { super(educationRepository); }

  async getAll(): Promise<IEducationDocument[]> {
    return educationRepository.findAll({}, { sortOrder: 1 });
  }

  async create(data: Partial<IEducationDocument>): Promise<IEducationDocument> {
    const existing = await educationRepository.findOne({ degree: data.degree, school: data.school });
    if (existing) {
      return (await educationRepository.updateById(existing._id.toString(), data))!;
    }
    return educationRepository.create(data);
  }
}

export const educationService = new EducationService();
