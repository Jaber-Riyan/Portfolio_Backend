import { EducationModel } from './education.model';
import { IEducationDocument } from './education.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class EducationRepository extends BaseRepository<IEducationDocument> {
  constructor() { super(EducationModel); }
}

export const educationRepository = new EducationRepository();
