import { Document } from 'mongoose';

export interface ICertificate {
  title: string;
  issuer: string;
  date: string;
  link?: string;
  learned: string;
  sortOrder: number;
}

export interface ICertificateDocument extends ICertificate, Document {}
