import { certificatesRepository } from './certificates.repository';
import { ICertificateDocument } from './certificates.interface';
import { BaseService } from '../../shared/helpers/baseService';

class CertificatesService extends BaseService<ICertificateDocument, typeof certificatesRepository> {
  constructor() { super(certificatesRepository); }

  async getAll(): Promise<ICertificateDocument[]> {
    return certificatesRepository.findAll({}, { sortOrder: 1 });
  }
}

export const certificatesService = new CertificatesService();
