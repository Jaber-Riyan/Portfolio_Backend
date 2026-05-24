import { ContactModel } from './contact.model';
import { IContactDocument } from './contact.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class ContactRepository extends BaseRepository<IContactDocument> {
  constructor() { super(ContactModel); }
}

export const contactRepository = new ContactRepository();
