import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import User, { IUser } from '../models/User';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: 'Invalid token. User not found.' });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user as IUser;
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required.' });
    return;
  }
  next();
};

export const authorizeAdmin = [authenticate, isAdmin];
