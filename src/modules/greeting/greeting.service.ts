import { greetingRepository } from './greeting.repository';
import { IGreetingDocument } from './greeting.interface';
import { CreateGreetingDto, UpdateGreetingDto } from './greeting.types';
import { BaseService } from '../../shared/helpers/baseService';
import { ApiError } from '../../shared/errors/ApiError';
import { UploadService } from '../../core/storage/upload.service';

class GreetingService extends BaseService<IGreetingDocument, typeof greetingRepository> {
  constructor() { super(greetingRepository); }

  async getGreeting(): Promise<IGreetingDocument | null> {
    const docs = await greetingRepository.findAll();
    return docs[0] ?? null;
  }

  async createGreeting(dto: CreateGreetingDto, file?: Express.Multer.File): Promise<IGreetingDocument> {
    const payload: Partial<IGreetingDocument> = { ...dto } as unknown as Partial<IGreetingDocument>;
    if (file) payload.image = UploadService.getRelativePath(file.path);
    return greetingRepository.create(payload);
  }

  async updateGreeting(id: string, dto: UpdateGreetingDto, file?: Express.Multer.File): Promise<IGreetingDocument> {
    const existing = await greetingRepository.findById(id);
    if (!existing) throw ApiError.notFound('Greeting not found');
    const update: Partial<IGreetingDocument> = { ...dto } as unknown as Partial<IGreetingDocument>;
    if (file) update.image = await UploadService.handleImageUpdate(existing.image, file);
    const updated = await greetingRepository.updateById(id, update);
    if (!updated) throw ApiError.notFound('Greeting not found');
    return updated;
  }

  async deleteGreeting(id: string): Promise<IGreetingDocument> {
    const greeting = await greetingRepository.findById(id);
    if (!greeting) throw ApiError.notFound('Greeting not found');
    if (greeting.image) await UploadService.removeFile(greeting.image);
    const deleted = await greetingRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound('Greeting not found');
    return deleted;
  }
}

export const greetingService = new GreetingService();
