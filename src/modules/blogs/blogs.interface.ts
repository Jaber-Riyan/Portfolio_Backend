import { Document } from 'mongoose';
import { IUploadedImage } from '../../types';

export interface IBlog {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image: IUploadedImage;
  tags: string[];
  link?: string;
  readTime: number;
  published: boolean;
  draft: boolean;
  sortOrder: number;
}

export interface IBlogDocument extends IBlog, Document {}
