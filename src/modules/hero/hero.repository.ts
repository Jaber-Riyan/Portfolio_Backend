import { HeroModel } from './hero.model';
import { IHeroDocument } from './hero.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class HeroRepository extends BaseRepository<IHeroDocument> {
  constructor() {
    super(HeroModel);
  }
}

export const heroRepository = new HeroRepository();
