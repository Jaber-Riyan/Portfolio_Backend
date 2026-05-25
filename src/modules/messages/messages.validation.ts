import { z } from 'zod';

export const sendMessageSchema = z.object({
  senderName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  senderEmail: z.string().email('Invalid email address'),
  subject: z.string().max(200).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});
