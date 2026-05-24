import { z } from 'zod';

const githubLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  techStack: z.array(z.string()).optional(),
  summary: z.string().min(1, 'Summary is required'),
  description: z.string().min(1, 'Description is required'),
  githubLinks: z.array(githubLinkSchema).optional(),
  live: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const reorderSchema = z.object({
  ids: z.array(z.string()).min(1),
});
