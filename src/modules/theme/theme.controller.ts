import { Request, Response } from 'express';
import { themeService } from './theme.service';
import { THEME_MESSAGES } from './theme.constant';
import { ApiResponse } from '../../shared/response/ApiResponse';
import { catchAsync } from '../../shared/helpers/catchAsync';
import { SectionName } from '../../shared/constants';

export const getTheme = catchAsync(async (_req: Request, res: Response) => {
  ApiResponse.success(res, THEME_MESSAGES.FETCHED, await themeService.getTheme());
});

export const updateGlobalTheme = catchAsync(async (req: Request, res: Response) => {
  ApiResponse.success(res, THEME_MESSAGES.UPDATED, await themeService.updateGlobal(req.body));
});

export const updateSectionTheme = catchAsync(async (req: Request, res: Response) => {
  const section = req.params.section as SectionName;
  ApiResponse.success(
    res,
    THEME_MESSAGES.SECTION_UPDATED,
    await themeService.updateSection(section, req.body, req.file),
  );
});
