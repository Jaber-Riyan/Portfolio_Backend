import { Document } from 'mongoose';

export interface IReview {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  featured: boolean;
  sortOrder: number;
}

export interface IReviewDocument extends IReview, Document {}
