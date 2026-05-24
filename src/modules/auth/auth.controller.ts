import { Request, Response } from 'express';
import { authService } from './auth.service';
import { AUTH_MESSAGES, COOKIE_OPTIONS } from './auth.constant';
import { COOKIE_NAME } from '../../shared/constants';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.cookie(COOKIE_NAME, result.token, COOKIE_OPTIONS);
  ApiResponse.success(res, AUTH_MESSAGES.LOGIN_SUCCESS, result.user);
});

export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'lax' });
  ApiResponse.success(res, AUTH_MESSAGES.LOGOUT_SUCCESS, null);
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.getProfile(req.user!._id.toString());
  ApiResponse.success(res, AUTH_MESSAGES.PROFILE_FETCHED, {
    id: user._id,
    email: user.email,
    role: user.role,
  });
});
