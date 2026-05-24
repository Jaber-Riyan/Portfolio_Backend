import { Request, Response } from 'express';
import { blogsService } from './blogs.service';
import { BLOGS_MESSAGES } from './blogs.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const getBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await blogsService.getBlogs(req.query as never);
  ApiResponse.paginated(res, BLOGS_MESSAGES.FETCHED, result.data, result.meta);
});

export const createBlog = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.created(res, BLOGS_MESSAGES.CREATED, await blogsService.createBlog(req.body, req.file));
});

export const updateBlog = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, BLOGS_MESSAGES.UPDATED, await blogsService.updateBlog(req.params.id, req.body, req.file));
});

export const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, BLOGS_MESSAGES.DELETED, await blogsService.deleteBlog(req.params.id));
});

export const togglePublish = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, BLOGS_MESSAGES.PUBLISHED, await blogsService.togglePublish(req.params.id));
});
