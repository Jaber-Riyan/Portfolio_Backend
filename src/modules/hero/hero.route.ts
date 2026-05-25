import { Router } from 'express';
import { getHero, createHero, updateHero, deleteHero } from './hero.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createHeroSchema, updateHeroSchema } from './hero.validation';
import { upload } from '../../middleware/upload';

const router = Router();

router.get('/', getHero);
router.post('/', protect, authorizeAdmin, upload.single('profileImage'), validate(createHeroSchema), createHero);
router.patch('/:id', protect, authorizeAdmin, upload.single('profileImage'), validate(updateHeroSchema), updateHero);
router.delete('/:id', protect, authorizeAdmin, deleteHero);

export default router;
