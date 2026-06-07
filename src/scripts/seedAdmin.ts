import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../config/env';
import { UserModel } from '../modules/auth/auth.model';
import { hashPassword } from '../core/auth/bcrypt';

export const seedAdmin = async (): Promise<void> => {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB');

  const existing = await UserModel.findOne({ role: 'admin' });
  if (existing) {
    console.log(`Admin already exists: ${existing.email}`);
    await mongoose.disconnect();
    return;
  }

  const hashed = await hashPassword(env.adminPassword);
  const admin = await UserModel.create({
    email: env.adminEmail,
    password: hashed,
    role: 'admin',
  });

  console.log(`Admin created: ${admin.email}`);
  await mongoose.disconnect();
};

seedAdmin().catch((err) => {
  console.error('Seed admin failed:', err);
  process.exit(1);
});
