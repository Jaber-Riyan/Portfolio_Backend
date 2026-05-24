import { Document, UpdateQuery } from 'mongoose';
import { BaseRepository } from './baseRepository';
import { ApiError } from '../errors/ApiError';

export class BaseService<
  TDoc extends Document,
  TRepo extends BaseRepository<TDoc>,
> {
  constructor(protected readonly repository: TRepo) {}

  async getAll(): Promise<TDoc[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<TDoc> {
    const doc = await this.repository.findById(id);
    if (!doc) throw ApiError.notFound('Document not found');
    return doc;
  }

  async create(data: Partial<TDoc>): Promise<TDoc> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateQuery<TDoc>): Promise<TDoc> {
    const doc = await this.repository.updateById(id, data);
    if (!doc) throw ApiError.notFound('Document not found');
    return doc;
  }

  async delete(id: string): Promise<TDoc> {
    const doc = await this.repository.deleteById(id);
    if (!doc) throw ApiError.notFound('Document not found');
    return doc;
  }
}
