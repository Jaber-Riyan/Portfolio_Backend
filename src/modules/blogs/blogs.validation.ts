import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  excerpt: z.string().min(1, 'Excerpt is required'),
  body: z.string().min(1, 'Body is required'),
  tags: z.array(z.string()).optional(),
  link: z.string().url().optional().or(z.literal('')),
  readTime: z.number().positive().optional(),
  published: z.boolean().optional(),
  draft: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const updateBlogSchema = createBlogSchema.partial();
