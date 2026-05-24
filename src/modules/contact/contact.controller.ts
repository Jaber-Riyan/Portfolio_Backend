import { Request, Response } from 'express';
import { contactService } from './contact.service';
import { CONTACT_MESSAGES } from './contact.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getContact = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, CONTACT_MESSAGES.FETCHED, await contactService.getContact());
});

export const createContact = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, CONTACT_MESSAGES.CREATED, await contactService.create(req.body));
});

export const updateContact = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, CONTACT_MESSAGES.UPDATED, await contactService.update(req.params.id, req.body));
});

export const deleteContact = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, CONTACT_MESSAGES.DELETED, await contactService.delete(req.params.id));
});
