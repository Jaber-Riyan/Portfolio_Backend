import { z } from 'zod';

const skillItemSchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
});

export const createSkillCategorySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  sortOrder: z.number().optional(),
  items: z.array(skillItemSchema).optional(),
});

export const updateSkillCategorySchema = createSkillCategorySchema.partial();

export const reorderSchema = z.object({
  ids: z.array(z.string()).min(1, 'ids array is required'),
});
