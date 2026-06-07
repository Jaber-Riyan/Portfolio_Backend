import { certificatesRepository } from './certificates.repository';
import { ICertificateDocument } from './certificates.interface';
import { BaseService } from '../../shared/helpers/baseService';
import { knowledgeService } from '../knowledge/knowledge.service';
import { Types, UpdateQuery } from 'mongoose';
import { logger } from '../../shared/logger/logger';

class CertificatesService extends BaseService<ICertificateDocument, typeof certificatesRepository> {
  constructor() { super(certificatesRepository); }

  async getAll(): Promise<ICertificateDocument[]> {
    return certificatesRepository.findAll({}, { sortOrder: 1 });
  }

  async create(data: Partial<ICertificateDocument>): Promise<ICertificateDocument> {
    const existing = await certificatesRepository.findOne({ title: data.title });
    if (existing) {
      const updated = (await certificatesRepository.updateById(existing._id.toString(), data))!;
      this.syncKnowledge(updated._id as Types.ObjectId);
      return updated;
    }
    const created = await certificatesRepository.create(data);
    this.syncKnowledge(created._id as Types.ObjectId);
    return created;
  }

  async update(id: string, data: UpdateQuery<ICertificateDocument>): Promise<ICertificateDocument> {
    const updated = await super.update(id, data);
    this.syncKnowledge(updated._id as Types.ObjectId);
    return updated;
  }

  async delete(id: string): Promise<ICertificateDocument> {
    const deleted = await super.delete(id);
    knowledgeService
      .deleteChunks('certificate', deleted._id as Types.ObjectId)
      .catch((err) => logger.warn('[Knowledge] Failed to delete certificate chunk:', err));
    return deleted;
  }

  private syncKnowledge(id: Types.ObjectId): void {
    knowledgeService
      .indexCertificateById(id)
      .catch((err) => logger.warn('[Knowledge] Failed to index certificate:', err));
  }
}

export const certificatesService = new CertificatesService();
