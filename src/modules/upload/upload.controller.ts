import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const triggerCleanup = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, 'Storage is managed by UploadThing — no local cleanup needed.', { deleted: 0 });
});
