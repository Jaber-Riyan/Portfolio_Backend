import { IGlobalTheme, ISectionTheme } from './theme.interface';
import { SectionName } from '../../shared/constants';

export interface UpdateGlobalThemeDto extends Partial<IGlobalTheme> {}

export interface UpdateSectionThemeDto extends Partial<ISectionTheme> {
  section: SectionName;
}
