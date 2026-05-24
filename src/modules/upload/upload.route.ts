import { Router } from 'express';
import { triggerCleanup } from './upload.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';

const router = Router();

router.post('/cleanup', protect, authorizeAdmin, triggerCleanup);

export default router;
