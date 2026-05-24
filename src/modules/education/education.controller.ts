import { Request, Response } from 'express';
import { educationService } from './education.service';
import { EDUCATION_MESSAGES } from './education.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getEducation = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, EDUCATION_MESSAGES.FETCHED, await educationService.getAll());
});

export const createEducation = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, EDUCATION_MESSAGES.CREATED, await educationService.create(req.body));
});

export const updateEducation = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, EDUCATION_MESSAGES.UPDATED, await educationService.update(req.params.id, req.body));
});

export const deleteEducation = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, EDUCATION_MESSAGES.DELETED, await educationService.delete(req.params.id));
});
