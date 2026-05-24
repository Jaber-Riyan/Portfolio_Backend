import { Document } from 'mongoose';

export interface IBlog {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image: string;
  tags: string[];
  link?: string;
  readTime: number;
  published: boolean;
  draft: boolean;
  sortOrder: number;
}

export interface IBlogDocument extends IBlog, Document {}
