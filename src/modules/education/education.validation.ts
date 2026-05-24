import { z } from 'zod';

export const createEducationSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  school: z.string().min(1, 'School is required'),
  period: z.string().min(1, 'Period is required'),
  summary: z.string().min(1, 'Summary is required'),
  sortOrder: z.number().optional(),
});

export const updateEducationSchema = createEducationSchema.partial();
