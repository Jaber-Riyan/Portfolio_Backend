import { themeRepository } from './theme.repository';
import { IThemeDocument } from './theme.interface';
import { UpdateGlobalThemeDto } from './theme.types';
import { DEFAULT_THEME } from './theme.constant';
import { ApiError } from '../../shared/errors/ApiError';
import { UploadService } from '../../services/upload.service';
import { SectionName } from '../../shared/constants';
import { IUploadedImage } from '../../types';

class ThemeService {
  async getTheme(): Promise<IThemeDocument> {
    const themes = await themeRepository.findAll();
    if (themes.length > 0) return themes[0];
    return themeRepository.create(DEFAULT_THEME as Partial<IThemeDocument>);
  }

  async updateGlobal(dto: UpdateGlobalThemeDto): Promise<IThemeDocument> {
    const theme = await this.getTheme();
    const setObj: Record<string, unknown> = {};
    Object.entries(dto).forEach(([k, v]) => { if (v !== undefined) setObj[`global.${k}`] = v; });
    const updated = await themeRepository.updateById(theme._id.toString(), { $set: setObj });
    if (!updated) throw ApiError.internal('Failed to update theme');
    return updated;
  }

  async updateSection(
    section: SectionName,
    dto: Partial<{ bg: string; text: string; accent: string }>,
    file?: Express.Multer.File,
  ): Promise<IThemeDocument> {
    const theme = await this.getTheme();
    const setObj: Record<string, unknown> = {};
    Object.entries(dto).forEach(([k, v]) => { if (v !== undefined) setObj[`sections.${section}.${k}`] = v; });

    if (file) {
      const oldBgImage = (theme.sections as Record<string, { bgImage?: IUploadedImage }>)[section]?.bgImage;
      const newImage = await UploadService.replace(oldBgImage, file);
      setObj[`sections.${section}.bgImage`] = newImage;
    }

    const updated = await themeRepository.updateById(theme._id.toString(), { $set: setObj });
    if (!updated) throw ApiError.internal('Failed to update section theme');
    return updated;
  }
}

export const themeService = new ThemeService();
