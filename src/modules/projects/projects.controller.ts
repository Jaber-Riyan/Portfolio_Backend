import { Request, Response } from 'express';
import { projectsService } from './projects.service';
import { PROJECTS_MESSAGES } from './projects.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getProjects = catchAsync(async (req: Request, res: Response) => {
  const result = await projectsService.getProjects(req.query as never);
  ApiResponse.paginated(res, PROJECTS_MESSAGES.FETCHED, result.data, result.meta);
});

export const createProject = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, PROJECTS_MESSAGES.CREATED, await projectsService.createProject(req.body, req.file));
});

export const updateProject = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, PROJECTS_MESSAGES.UPDATED, await projectsService.updateProject(req.params.id, req.body, req.file));
});

export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, PROJECTS_MESSAGES.DELETED, await projectsService.deleteProject(req.params.id));
});

export const reorderProjects = catchAsync(async (req: Request, res: Response) => {
  await projectsService.reorder(req.body.ids);
  ApiResponse.success(res, PROJECTS_MESSAGES.REORDERED, null);
});
