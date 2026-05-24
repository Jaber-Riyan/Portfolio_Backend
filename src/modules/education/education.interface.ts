import { Document } from 'mongoose';

export interface IEducation {
  degree: string;
  school: string;
  period: string;
  summary: string;
  sortOrder: number;
}

export interface IEducationDocument extends IEducation, Document {}
