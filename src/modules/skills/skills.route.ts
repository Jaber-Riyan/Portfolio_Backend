import { Router } from 'express';
import { getSkills, createSkillCategory, updateSkillCategory, deleteSkillCategory, reorderSkills } from './skills.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createSkillCategorySchema, updateSkillCategorySchema, reorderSchema } from './skills.validation';

const router = Router();

router.get('/', getSkills);
router.post('/', protect, authorizeAdmin, validate(createSkillCategorySchema), createSkillCategory);
router.patch('/reorder', protect, authorizeAdmin, validate(reorderSchema), reorderSkills);
router.patch('/:id', protect, authorizeAdmin, validate(updateSkillCategorySchema), updateSkillCategory);
router.delete('/:id', protect, authorizeAdmin, deleteSkillCategory);

export default router;
