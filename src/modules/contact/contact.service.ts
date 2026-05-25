import { contactRepository } from './contact.repository';
import { IContactDocument } from './contact.interface';
import { BaseService } from '../../shared/helpers/baseService';
import { UpdateQuery } from 'mongoose';

class ContactService extends BaseService<IContactDocument, typeof contactRepository> {
  constructor() { super(contactRepository); }

  async getContact(): Promise<IContactDocument | null> {
    const docs = await contactRepository.findAll();
    return docs[0] ?? null;
  }

  async create(data: Partial<IContactDocument>): Promise<IContactDocument> {
    const existing = await this.getContact();
    if (existing) {
      return (await contactRepository.updateById(existing._id.toString(), data as UpdateQuery<IContactDocument>))!;
    }
    return contactRepository.create(data);
  }
}

export const contactService = new ContactService();
