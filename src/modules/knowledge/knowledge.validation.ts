import { z } from 'zod';

// Inline the values to satisfy Zod v4's mutable tuple constraint for z.enum
export const syncSourceSchema = z.object({
  sourceType: z
    .enum([
      'hero', 'about', 'project', 'experience', 'education',
      'certificate', 'review', 'blog', 'contact', 'skill',
    ])
    .optional(),
});
