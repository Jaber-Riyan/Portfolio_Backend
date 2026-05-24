import { Request, Response } from 'express';
import { greetingService } from './greeting.service';
import { GREETING_MESSAGES } from './greeting.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getGreeting = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, GREETING_MESSAGES.FETCHED, await greetingService.getGreeting());
});

export const createGreeting = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, GREETING_MESSAGES.CREATED, await greetingService.createGreeting(req.body, req.file));
});

export const updateGreeting = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, GREETING_MESSAGES.UPDATED, await greetingService.updateGreeting(req.params.id, req.body, req.file));
});

export const deleteGreeting = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, GREETING_MESSAGES.DELETED, await greetingService.deleteGreeting(req.params.id));
});
