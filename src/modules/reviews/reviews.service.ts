import { reviewsRepository } from './reviews.repository';
import { IReviewDocument } from './reviews.interface';
import { CreateReviewDto, UpdateReviewDto } from './reviews.types';
import { BaseService } from '../../shared/helpers/baseService';
import { ApiError } from '../../shared/errors/ApiError';
import { UploadService } from '../../core/storage/upload.service';

class ReviewsService extends BaseService<IReviewDocument, typeof reviewsRepository> {
  constructor() { super(reviewsRepository); }

  async getAll(): Promise<IReviewDocument[]> {
    return reviewsRepository.findAll({}, { sortOrder: 1 });
  }

  async createReview(dto: CreateReviewDto, file?: Express.Multer.File): Promise<IReviewDocument> {
    const payload: Partial<IReviewDocument> = { ...dto } as unknown as Partial<IReviewDocument>;
    if (file) payload.avatar = UploadService.getRelativePath(file.path);
    return reviewsRepository.create(payload);
  }

  async updateReview(id: string, dto: UpdateReviewDto, file?: Express.Multer.File): Promise<IReviewDocument> {
    const existing = await reviewsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Review not found');
    const update: Partial<IReviewDocument> = { ...dto } as unknown as Partial<IReviewDocument>;
    if (file) update.avatar = await UploadService.handleImageUpdate(existing.avatar, file);
    const updated = await reviewsRepository.updateById(id, update);
    if (!updated) throw ApiError.notFound('Review not found');
    return updated;
  }

  async deleteReview(id: string): Promise<IReviewDocument> {
    const review = await reviewsRepository.findById(id);
    if (!review) throw ApiError.notFound('Review not found');
    if (review.avatar) await UploadService.removeFile(review.avatar);
    const deleted = await reviewsRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound('Review not found');
    return deleted;
  }
}

export const reviewsService = new ReviewsService();
