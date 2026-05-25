import { aboutRepository } from './about.repository';
import { IAboutDocument } from './about.interface';
import { BaseService } from '../../shared/helpers/baseService';
import { UpdateQuery } from 'mongoose';

class AboutService extends BaseService<IAboutDocument, typeof aboutRepository> {
  constructor() { super(aboutRepository); }

  async getAbout(): Promise<IAboutDocument | null> {
    const docs = await aboutRepository.findAll();
    return docs[0] ?? null;
  }

  async create(data: Partial<IAboutDocument>): Promise<IAboutDocument> {
    const existing = await this.getAbout();
    if (existing) {
      return (await aboutRepository.updateById(existing._id.toString(), data as UpdateQuery<IAboutDocument>))!;
    }
    return aboutRepository.create(data);
  }
}

export const aboutService = new AboutService();
