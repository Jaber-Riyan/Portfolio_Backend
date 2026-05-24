import { AboutModel } from './about.model';
import { IAboutDocument } from './about.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class AboutRepository extends BaseRepository<IAboutDocument> {
  constructor() { super(AboutModel); }
}

export const aboutRepository = new AboutRepository();
