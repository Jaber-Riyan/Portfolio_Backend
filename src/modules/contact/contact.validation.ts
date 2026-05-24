import { z } from 'zod';

export const createContactSchema = z.object({
  headline: z.string().min(1, 'Headline is required'),
  description: z.string().min(1, 'Description is required'),
  email: z.string().email('Valid email required'),
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
});

export const updateContactSchema = createContactSchema.partial();
