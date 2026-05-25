import { certificatesRepository } from './certificates.repository';
import { ICertificateDocument } from './certificates.interface';
import { BaseService } from '../../shared/helpers/baseService';

class CertificatesService extends BaseService<ICertificateDocument, typeof certificatesRepository> {
  constructor() { super(certificatesRepository); }

  async getAll(): Promise<ICertificateDocument[]> {
    return certificatesRepository.findAll({}, { sortOrder: 1 });
  }

  async create(data: Partial<ICertificateDocument>): Promise<ICertificateDocument> {
    const existing = await certificatesRepository.findOne({ title: data.title });
    if (existing) {
      return (await certificatesRepository.updateById(existing._id.toString(), data))!;
    }
    return certificatesRepository.create(data);
  }
}

export const certificatesService = new CertificatesService();
