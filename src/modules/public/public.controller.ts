import { Request, Response } from 'express';
import { publicService } from './public.service';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getAllPublic = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, 'Portfolio data fetched successfully', await publicService.getAllData());
});

export const getPublicHero = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, 'Hero fetched', await publicService.getHero());
});

export const getPublicAbout = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, 'About fetched', await publicService.getAbout());
});

export const getPublicProjects = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, 'Projects fetched', await publicService.getProjects());
});

export const getPublicTheme = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, 'Theme fetched', await publicService.getTheme());
});
