import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { logger } from '../logger/logger';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (err instanceof ApiError) {
    if (err.statusCode >= 500) {
      logger.error(`[${req.method}] ${req.path} - ${err.message}`, {
        stack: err.stack,
      });
    }
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.errors ?? null,
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Duplicate key error',
      error: (err as { keyValue?: unknown }).keyValue ?? null,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: err.message,
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token', error: null });
    return;
  }
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired', error: null });
    return;
  }

  logger.error(`Unhandled error [${req.method}] ${req.path}:`, err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : null,
  });
};
