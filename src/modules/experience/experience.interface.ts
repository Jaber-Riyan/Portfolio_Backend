import { Document } from 'mongoose';

export interface IExperience {
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  location: string;
  description: string;
  impact: string[];
  sortOrder: number;
}

export interface IExperienceDocument extends IExperience, Document {}
