import { z } from 'zod';

const deviceInfoSchema = z.object({
  browser: z.string().default(''),
  os: z.string().default(''),
  deviceType: z.string().default(''),
  language: z.string().default(''),
  networkProviderName: z.string().default(''),
  screenWidth: z.number().default(0),
  screenHeight: z.number().default(0),
});

export const startSessionSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  deviceInfo: deviceInfoSchema.optional(),
});

export const sendMessageSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  deviceId: z.string().min(1, 'Device ID is required'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
});

export const endSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  deviceId: z.string().min(1, 'Device ID is required'),
});

export const heartbeatSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  deviceId: z.string().min(1, 'Device ID is required'),
});
