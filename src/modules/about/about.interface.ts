import { Document } from 'mongoose';

export interface IAbout {
  intro: string;
  journey: string;
  work: string;
  hobbies: string;
  belief: string;
}

export interface IAboutDocument extends IAbout, Document {}
