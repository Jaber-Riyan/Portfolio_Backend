import { Request, Response } from 'express';
import { experienceService } from './experience.service';
import { EXPERIENCE_MESSAGES } from './experience.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getExperience = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, EXPERIENCE_MESSAGES.FETCHED, await experienceService.getAll());
});

export const createExperience = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, EXPERIENCE_MESSAGES.CREATED, await experienceService.create(req.body));
});

export const updateExperience = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, EXPERIENCE_MESSAGES.UPDATED, await experienceService.update(req.params.id, req.body));
});

export const deleteExperience = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, EXPERIENCE_MESSAGES.DELETED, await experienceService.delete(req.params.id));
});
