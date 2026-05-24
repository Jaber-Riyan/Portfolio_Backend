import { Request, Response } from 'express';
import { CleanupService } from '../../core/storage/cleanup.service';
import { HeroModel } from '../hero/hero.model';
import { ProjectModel } from '../projects/projects.model';
import { BlogModel } from '../blogs/blogs.model';
import { ReviewModel } from '../reviews/reviews.model';
import { GreetingModel } from '../greeting/greeting.model';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const triggerCleanup = catchAsync(async (_req: Request, res: Response) => {
  const [heroes, projects, blogs, reviews, greetings] = await Promise.all([
    HeroModel.find().select('profileImage').lean(),
    ProjectModel.find().select('image').lean(),
    BlogModel.find().select('image').lean(),
    ReviewModel.find().select('avatar').lean(),
    GreetingModel.find().select('image').lean(),
  ]);

  const paths = [
    ...heroes.map((h) => h.profileImage),
    ...projects.map((p) => p.image),
    ...blogs.map((b) => b.image),
    ...reviews.map((r) => r.avatar),
    ...greetings.map((g) => g.image),
  ].filter(Boolean) as string[];

  const deleted = await CleanupService.cleanOrphans(paths);
  ApiResponse.success(res, `Cleanup complete: ${deleted} orphaned files deleted`, { deleted });
});
