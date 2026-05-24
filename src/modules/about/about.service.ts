import { aboutRepository } from './about.repository';
import { IAboutDocument } from './about.interface';
import { BaseService } from '../../shared/helpers/baseService';

class AboutService extends BaseService<IAboutDocument, typeof aboutRepository> {
  constructor() { super(aboutRepository); }

  async getAbout(): Promise<IAboutDocument | null> {
    const docs = await aboutRepository.findAll();
    return docs[0] ?? null;
  }
}

export const aboutService = new AboutService();
