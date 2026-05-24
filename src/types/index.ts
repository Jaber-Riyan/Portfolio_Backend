import { Request } from 'express';
import { IUserDocument } from '../modules/auth/auth.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}

export interface AuthRequest extends Request {
  user: IUserDocument;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FileUploadResult {
  path: string;
  filename: string;
  mimetype: string;
  size: number;
}
