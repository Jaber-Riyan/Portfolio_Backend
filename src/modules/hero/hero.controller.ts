import { Request, Response } from 'express';
import { heroService } from './hero.service';
import { HERO_MESSAGES } from './hero.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getHero = catchAsync(async (_req: Request, res: Response) => {
  const data = await heroService.getHero();
  ApiResponse.success(res, HERO_MESSAGES.FETCHED, data);
});

export const createHero = catchAsync(async (req: Request, res: Response) => {
  const data = await heroService.createHero(req.body, req.file);
  ApiResponse.created(res, HERO_MESSAGES.CREATED, data);
});

export const updateHero = catchAsync(async (req: Request, res: Response) => {
  const data = await heroService.updateHero(req.params.id, req.body, req.file);
  ApiResponse.success(res, HERO_MESSAGES.UPDATED, data);
});

export const deleteHero = catchAsync(async (req: Request, res: Response) => {
  const data = await heroService.deleteHero(req.params.id);
  ApiResponse.success(res, HERO_MESSAGES.DELETED, data);
});
