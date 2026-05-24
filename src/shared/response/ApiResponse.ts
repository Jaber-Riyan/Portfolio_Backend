import { Response } from 'express';

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string,
    data: T,
    statusCode = 200,
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created<T>(res: Response, message: string, data: T): Response {
    return ApiResponse.success(res, message, data, 201);
  }

  static error(
    res: Response,
    message: string,
    statusCode = 500,
    error?: unknown,
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error ?? null,
    });
  }

  static paginated<T>(
    res: Response,
    message: string,
    data: T[],
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    },
  ): Response {
    return res.status(200).json({
      success: true,
      message,
      data,
      meta,
    });
  }
}
