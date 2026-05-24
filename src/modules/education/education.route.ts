import { Router } from 'express';
import { getEducation, createEducation, updateEducation, deleteEducation } from './education.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createEducationSchema, updateEducationSchema } from './education.validation';

const router = Router();

router.get('/', getEducation);
router.post('/', protect, authorizeAdmin, validate(createEducationSchema), createEducation);
router.patch('/:id', protect, authorizeAdmin, validate(updateEducationSchema), updateEducation);
router.delete('/:id', protect, authorizeAdmin, deleteEducation);

export default router;
