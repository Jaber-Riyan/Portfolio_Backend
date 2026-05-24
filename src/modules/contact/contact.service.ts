import { contactRepository } from './contact.repository';
import { IContactDocument } from './contact.interface';
import { BaseService } from '../../shared/helpers/baseService';

class ContactService extends BaseService<IContactDocument, typeof contactRepository> {
  constructor() { super(contactRepository); }

  async getContact(): Promise<IContactDocument | null> {
    const docs = await contactRepository.findAll();
    return docs[0] ?? null;
  }
}

export const contactService = new ContactService();
