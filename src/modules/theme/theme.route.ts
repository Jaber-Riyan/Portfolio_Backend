import { Router } from 'express';
import { getTheme, updateGlobalTheme, updateSectionTheme } from './theme.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { updateGlobalThemeSchema, updateSectionThemeSchema, sectionParamSchema } from './theme.validation';
import { upload } from '../../middleware/upload';

const router = Router();

router.get('/', getTheme);
router.patch('/', protect, authorizeAdmin, validate(updateGlobalThemeSchema), updateGlobalTheme);
router.patch(
  '/:section',
  protect,
  authorizeAdmin,
  validate(sectionParamSchema, 'params'),
  upload.single('bgImage'),
  validate(updateSectionThemeSchema),
  updateSectionTheme,
);

export default router;
