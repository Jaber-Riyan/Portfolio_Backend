import { ThemeModel } from './theme.model';
import { IThemeDocument } from './theme.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class ThemeRepository extends BaseRepository<IThemeDocument> {
  constructor() { super(ThemeModel); }
}

export const themeRepository = new ThemeRepository();
