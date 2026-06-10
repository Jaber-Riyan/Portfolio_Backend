import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().optional().default('cookie_secret_fallback'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  ADMIN_EMAIL: z.string().email().default('admin@mail.com'),
  ADMIN_PASSWORD: z.string().min(6).default('password123'),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE: z.string().default('5242880'),
  NODEMAILER_GMAIL: z.string().default(''),
  NODEMAILER_PASS: z.string().default(''),
  NOTIFY_EMAIL: z.string().default(''),
  UPLOADTHING_TOKEN: z.string().default(''),
  AION_API_KEY: z.string().default(''),
  OPEN_ROUTER_API_KEY: z.string().default(''),
  HF_TOKEN: z.string().default('')
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.flatten().fieldErrors;
  // Throw an error instead of exiting the process so serverless functions can handle it.
  throw new Error(`Invalid environment variables: ${JSON.stringify(details)}`);
}

export const env = {
  port: parseInt(parsed.data.PORT, 10),
  nodeEnv: parsed.data.NODE_ENV,
  mongoUri: parsed.data.MONGO_URI,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  cookieSecret: parsed.data.COOKIE_SECRET,
  corsOrigin: parsed.data.CORS_ORIGIN,
  adminEmail: parsed.data.ADMIN_EMAIL,
  adminPassword: parsed.data.ADMIN_PASSWORD,
  uploadDir: parsed.data.UPLOAD_DIR,
  maxFileSize: parseInt(parsed.data.MAX_FILE_SIZE, 10),
  isDev: parsed.data.NODE_ENV === 'development',
  isProd: parsed.data.NODE_ENV === 'production',
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    user: parsed.data.NODEMAILER_GMAIL,
    pass: parsed.data.NODEMAILER_PASS,
  },
  notifyEmail: parsed.data.NOTIFY_EMAIL || parsed.data.NODEMAILER_GMAIL,
  uploadthingToken: parsed.data.UPLOADTHING_TOKEN,
  AION_API_KEY: parsed.data.AION_API_KEY,
  OPEN_ROUTER_API_KEY: parsed.data.OPEN_ROUTER_API_KEY,
  HF_TOKEN: parsed.data.HF_TOKEN,
};
