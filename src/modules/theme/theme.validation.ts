import { z } from 'zod';
import { SECTION_NAMES } from '../../shared/constants';

const sectionThemeSchema = z.object({
  bg: z.string().optional(),
  text: z.string().optional(),
  accent: z.string().optional(),
});

export const updateGlobalThemeSchema = z.object({
  primary: z.string().optional(),
  secondary: z.string().optional(),
  background: z.string().optional(),
  text: z.string().optional(),
  muted: z.string().optional(),
  panel: z.string().optional(),
  animationSpeed: z.string().optional(),
}).partial();

export const updateSectionThemeSchema = sectionThemeSchema;

export const sectionParamSchema = z.object({
  section: z.enum(SECTION_NAMES as unknown as [string, ...string[]]),
});
