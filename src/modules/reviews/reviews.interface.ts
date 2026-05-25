import { Document } from 'mongoose';
import { IUploadedImage } from '../../types';

export interface IReview {
  quote: string;
  author: string;
  role: string;
  avatar: IUploadedImage;
  featured: boolean;
  sortOrder: number;
}

export interface IReviewDocument extends IReview, Document {}
