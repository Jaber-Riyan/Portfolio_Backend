import { heroRepository } from './hero.repository';
import { CreateHeroDto, UpdateHeroDto } from './hero.types';
import { IHeroDocument } from './hero.interface';
import { ApiError } from '../../shared/errors/ApiError';
import { UploadService } from '../../core/storage/upload.service';
import { BaseService } from '../../shared/helpers/baseService';
import { resolve } from 'dns';

class HeroService extends BaseService<IHeroDocument, typeof heroRepository> {
  constructor() {
    super(heroRepository);
  }

  async getHero(): Promise<IHeroDocument | null> {
    const heroes = await heroRepository.findAll();
    return heroes[0] ?? null;
  }

  async createHero(
    dto: CreateHeroDto,
    file?: Express.Multer.File,
  ): Promise<IHeroDocument> {
    const payload: Partial<IHeroDocument> = { ...dto } as unknown as Partial<IHeroDocument>;
    if (file) {
      payload.profileImage = UploadService.getRelativePath(file.path);
    }
    return heroRepository.create(payload);
  }

  async updateHero(
    id: string,
    dto: UpdateHeroDto,
    file?: Express.Multer.File,
  ): Promise<IHeroDocument> {
    const existing = await heroRepository.findById(id);
    if (!existing) throw ApiError.notFound('Hero not found');

    const update: Partial<IHeroDocument> = { ...dto } as unknown as Partial<IHeroDocument>;

    if (file) {
      update.profileImage = await UploadService.handleImageUpdate(
        existing.profileImage,
        file,
      );
    }

    const updated = await heroRepository.updateById(id, update);
    if (!updated) throw ApiError.notFound('Hero not found');
    return updated;
  }

  async deleteHero(id: string): Promise<IHeroDocument> {
    const hero = await heroRepository.findById(id);
    if (!hero) throw ApiError.notFound('Hero not found');

    if (hero.profileImage) {
      await UploadService.removeFile(hero.profileImage);
    }

    const deleted = await heroRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound('Hero not found');
    return deleted;
  }
}

export const heroService = new HeroService();
