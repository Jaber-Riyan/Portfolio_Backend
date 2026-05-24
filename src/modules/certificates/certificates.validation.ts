import { z } from 'zod';

export const createCertificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  link: z.string().url().optional().or(z.literal('')),
  learned: z.string().min(1, 'Learned is required'),
  sortOrder: z.number().optional(),
});

export const updateCertificateSchema = createCertificateSchema.partial();
