import { Request, Response } from 'express';
import { reviewsService } from './reviews.service';
import { REVIEWS_MESSAGES } from './reviews.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getReviews = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, REVIEWS_MESSAGES.FETCHED, await reviewsService.getAll());
});

export const createReview = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, REVIEWS_MESSAGES.CREATED, await reviewsService.createReview(req.body, req.file));
});

export const updateReview = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, REVIEWS_MESSAGES.UPDATED, await reviewsService.updateReview(req.params.id, req.body, req.file));
});

export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, REVIEWS_MESSAGES.DELETED, await reviewsService.deleteReview(req.params.id));
});
