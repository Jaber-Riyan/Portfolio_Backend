import { Request, Response } from 'express';
import { messagesService } from './messages.service';
import { MESSAGES_MESSAGES } from './messages.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const sendMessage = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, MESSAGES_MESSAGES.SENT, await messagesService.send(req.body));
});

export const getMessages = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, MESSAGES_MESSAGES.FETCHED, await messagesService.getAll());
});

export const markMessageRead = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, MESSAGES_MESSAGES.MARKED_READ, await messagesService.markRead(req.params.id));
});

export const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, MESSAGES_MESSAGES.DELETED, await messagesService.delete(req.params.id));
});
