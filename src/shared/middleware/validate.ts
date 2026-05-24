import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../errors/ApiError';

type ValidationTarget = 'body' | 'params' | 'query';

export const validate =
  (schema: ZodSchema, target: ValidationTarget = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req[target]);
      if (!result.success) {
        const errors = (result.error as ZodError).flatten().fieldErrors;
        throw ApiError.badRequest('Validation failed', errors);
      }
      req[target] = result.data;
      next();
    } catch (err) {
      next(err);
    }
  };
