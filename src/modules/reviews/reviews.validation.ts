import { z } from 'zod';

export const createReviewSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  author: z.string().min(1, 'Author is required'),
  role: z.string().min(1, 'Role is required'),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const updateReviewSchema = createReviewSchema.partial();
