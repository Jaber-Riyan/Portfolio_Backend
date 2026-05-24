import { ReviewModel } from './reviews.model';
import { IReviewDocument } from './reviews.interface';
import { BaseRepository } from '../../shared/helpers/baseRepository';

export class ReviewsRepository extends BaseRepository<IReviewDocument> {
  constructor() { super(ReviewModel); }
}

export const reviewsRepository = new ReviewsRepository();
