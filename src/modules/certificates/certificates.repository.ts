import { CertificateModel } from './certificates.model';
import { ICertificateDocument } from './certificates.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class CertificatesRepository extends BaseRepository<ICertificateDocument> {
  constructor() { super(CertificateModel); }
}

export const certificatesRepository = new CertificatesRepository();
