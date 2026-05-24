import { Request, Response } from 'express';
import { aboutService } from './about.service';
import { ABOUT_MESSAGES } from './about.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getAbout = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, ABOUT_MESSAGES.FETCHED, await aboutService.getAbout());
});

export const createAbout = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, ABOUT_MESSAGES.CREATED, await aboutService.create(req.body));
});

export const updateAbout = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, ABOUT_MESSAGES.UPDATED, await aboutService.update(req.params.id, req.body));
});

export const deleteAbout = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, ABOUT_MESSAGES.DELETED, await aboutService.delete(req.params.id));
});
