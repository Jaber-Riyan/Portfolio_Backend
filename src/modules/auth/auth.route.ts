import { Router } from 'express';
import { login, logout, getMe } from './auth.controller';
import { validate } from '../../shared/middleware/validate';
import { protect } from '../../shared/middleware/auth';
import { loginSchema } from './auth.validation';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
