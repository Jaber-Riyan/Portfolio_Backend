import { Document } from 'mongoose';

export interface IMessage {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  read: boolean;
}

export interface IMessageDocument extends IMessage, Document {}
