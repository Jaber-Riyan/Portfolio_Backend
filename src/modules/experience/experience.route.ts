import { Router } from 'express';
import { getExperience, createExperience, updateExperience, deleteExperience } from './experience.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createExperienceSchema, updateExperienceSchema } from './experience.validation';

const router = Router();

router.get('/', getExperience);
router.post('/', protect, authorizeAdmin, validate(createExperienceSchema), createExperience);
router.patch('/:id', protect, authorizeAdmin, validate(updateExperienceSchema), updateExperience);
router.delete('/:id', protect, authorizeAdmin, deleteExperience);

export default router;
