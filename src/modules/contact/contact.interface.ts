import { Document } from 'mongoose';

export interface IContact {
  headline: string;
  description: string;
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface IContactDocument extends IContact, Document {}
