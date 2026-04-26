import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { config } from '../config';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const createAdminUser = async (email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  const user = new User({
    email,
    password: hashedPassword,
    role: 'admin',
  });
  await user.save();
  return user;
};
