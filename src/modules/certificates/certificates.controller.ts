import { Request, Response } from 'express';
import { certificatesService } from './certificates.service';
import { CERTIFICATES_MESSAGES } from './certificates.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getCertificates = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, CERTIFICATES_MESSAGES.FETCHED, await certificatesService.getAll());
});

export const createCertificate = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, CERTIFICATES_MESSAGES.CREATED, await certificatesService.create(req.body));
});

export const updateCertificate = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, CERTIFICATES_MESSAGES.UPDATED, await certificatesService.update(req.params.id, req.body));
});

export const deleteCertificate = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, CERTIFICATES_MESSAGES.DELETED, await certificatesService.delete(req.params.id));
});
