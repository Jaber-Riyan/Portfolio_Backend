import { Router } from 'express';
import heroRouter from '../modules/hero/hero.route';
import aboutRouter from '../modules/about/about.route';
import skillsRouter from '../modules/skills/skills.route';
import experienceRouter from '../modules/experience/experience.route';
import projectsRouter from '../modules/projects/projects.route';
import educationRouter from '../modules/education/education.route';
import certificatesRouter from '../modules/certificates/certificates.route';
import reviewsRouter from '../modules/reviews/reviews.route';
import blogsRouter from '../modules/blogs/blogs.route';
import contactRouter from '../modules/contact/contact.route';
import greetingRouter from '../modules/greeting/greeting.route';
import themeRouter from '../modules/theme/theme.route';
import publicRouter from '../modules/public/public.route';
import uploadRouter from '../modules/upload/upload.route';
import messagesRouter from '../modules/messages/messages.route';
import authRouter from '../modules/auth/auth.route';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ success: true, message: 'Portfolio CMS API is running', version: '1.0.0' });
});

router.use('/auth', authRouter);
router.use('/hero', heroRouter);
router.use('/about', aboutRouter);
router.use('/skills', skillsRouter);
router.use('/experience', experienceRouter);
router.use('/projects', projectsRouter);
router.use('/education', educationRouter);
router.use('/certificates', certificatesRouter);
router.use('/reviews', reviewsRouter);
router.use('/blogs', blogsRouter);
router.use('/contact', contactRouter);
router.use('/greeting', greetingRouter);
router.use('/theme', themeRouter);
router.use('/public', publicRouter);
router.use('/upload', uploadRouter);
router.use('/messages', messagesRouter);

export default router;
