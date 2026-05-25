import { MessageModel } from './messages.model';
import { IMessageDocument } from './messages.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class MessagesRepository extends BaseRepository<IMessageDocument> {
  constructor() { super(MessageModel); }
}

export const messagesRepository = new MessagesRepository();
