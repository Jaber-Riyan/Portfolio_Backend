import { z } from 'zod';

export const createGreetingSchema = z.object({
  enabled: z.boolean().optional(),
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  bgColor: z.string().optional(),
  textColor: z.string().optional(),
  ctaLabel: z.string().min(1, 'CTA label is required'),
  ctaHref: z.string().min(1, 'CTA href is required'),
});

export const updateGreetingSchema = createGreetingSchema.partial();
