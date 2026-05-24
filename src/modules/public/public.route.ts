import { Router } from 'express';
import { getAllPublic, getPublicHero, getPublicAbout, getPublicProjects, getPublicTheme } from './public.controller';

const router = Router();

router.get('/all', getAllPublic);
router.get('/hero', getPublicHero);
router.get('/about', getPublicAbout);
router.get('/projects', getPublicProjects);
router.get('/theme', getPublicTheme);

export default router;
