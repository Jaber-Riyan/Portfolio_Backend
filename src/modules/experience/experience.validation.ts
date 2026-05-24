import { z } from 'zod';

export const createExperienceSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  companyUrl: z.string().url().optional().or(z.literal('')),
  period: z.string().min(1, 'Period is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  impact: z.array(z.string()).optional(),
  sortOrder: z.number().optional(),
});

export const updateExperienceSchema = createExperienceSchema.partial();
