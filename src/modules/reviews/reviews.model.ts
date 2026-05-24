import mongoose, { Schema } from 'mongoose';
import { IReviewDocument } from './reviews.interface';

const reviewSchema = new Schema<IReviewDocument>(
  {
    quote: { type: String, required: true },
    author: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

reviewSchema.index({ sortOrder: 1 });
reviewSchema.index({ featured: 1 });

export const ReviewModel = mongoose.model<IReviewDocument>('Review', reviewSchema);
