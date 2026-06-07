import { Request, Response } from 'express';
import { knowledgeService } from './knowledge.service';
import { KNOWLEDGE_MESSAGES } from './knowledge.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const triggerFullSync = catchAsync(async (_req: Request, res: Response) => {
  // Run sync in background and respond immediately
  knowledgeService.syncAll().catch(() => null);
  ApiResponse.success(res, KNOWLEDGE_MESSAGES.SYNCED, { status: 'sync_started' });
});

export const getStats = catchAsync(async (_req: Request, res: Response) => {
  const stats = await knowledgeService.getStats();
  ApiResponse.success(res, KNOWLEDGE_MESSAGES.FETCHED, stats);
});
