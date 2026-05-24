import { Request, Response } from 'express';
import { skillsService } from './skills.service';
import { SKILLS_MESSAGES } from './skills.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getSkills = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, SKILLS_MESSAGES.FETCHED, await skillsService.getAll());
});

export const createSkillCategory = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, SKILLS_MESSAGES.CREATED, await skillsService.create(req.body));
});

export const updateSkillCategory = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, SKILLS_MESSAGES.UPDATED, await skillsService.update(req.params.id, req.body));
});

export const deleteSkillCategory = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, SKILLS_MESSAGES.DELETED, await skillsService.delete(req.params.id));
});

export const reorderSkills = catchAsync(async (req: Request, res: Response) => {
  await skillsService.reorder(req.body.ids);
  ApiResponse.success(res, SKILLS_MESSAGES.REORDERED, null);
});
