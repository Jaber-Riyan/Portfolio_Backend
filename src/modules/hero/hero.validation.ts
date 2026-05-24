import { z } from 'zod';

const ctaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const socialSchema = z.object({
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  facebook: z.string().url().optional().or(z.literal('')),
}).optional();

export const createHeroSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  description: z.string().min(1, 'Description is required'),
  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,
  socialLinks: socialSchema,
});

export const updateHeroSchema = createHeroSchema.partial();
