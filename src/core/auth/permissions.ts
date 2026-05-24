import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwt';
import { ApiError } from '../../shared/errors/ApiError';
import { COOKIE_NAME, ROLES } from '../../shared/constants';
import { UserModel } from '../../modules/auth/auth.model';

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.cookies?.[COOKIE_NAME]) {
      token = req.cookies[COOKIE_NAME] as string;
    } else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) throw ApiError.unauthorized('Authentication required');

    const decoded = verifyToken(token);
    const user = await UserModel.findById(decoded.id).select('+password');

    if (!user) throw ApiError.unauthorized('User no longer exists');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const authorizeAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  if (req.user?.role !== ROLES.ADMIN) {
    next(ApiError.forbidden('Admin access required'));
    return;
  }
  next();
};
