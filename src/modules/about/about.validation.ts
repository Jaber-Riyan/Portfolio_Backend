import { z } from 'zod';

export const createAboutSchema = z.object({
  intro: z.string().min(1, 'Intro is required'),
  journey: z.string().min(1, 'Journey is required'),
  work: z.string().min(1, 'Work is required'),
  hobbies: z.string().min(1, 'Hobbies is required'),
  belief: z.string().min(1, 'Belief is required'),
});

export const updateAboutSchema = createAboutSchema.partial();
