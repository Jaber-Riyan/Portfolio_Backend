import { Router } from 'express';
import { getAbout, createAbout, updateAbout, deleteAbout } from './about.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createAboutSchema, updateAboutSchema } from './about.validation';

const router = Router();

router.get('/', getAbout);
router.post('/', protect, authorizeAdmin, validate(createAboutSchema), createAbout);
router.patch('/:id', protect, authorizeAdmin, validate(updateAboutSchema), updateAbout);
router.delete('/:id', protect, authorizeAdmin, deleteAbout);

export default router;
