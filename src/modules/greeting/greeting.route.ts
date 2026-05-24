import { Router } from 'express';
import { getGreeting, createGreeting, updateGreeting, deleteGreeting } from './greeting.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createGreetingSchema, updateGreetingSchema } from './greeting.validation';
import { uploaders } from '../../core/storage/multer';

const router = Router();
const upload = uploaders.greeting;

router.get('/', getGreeting);
router.post('/', protect, authorizeAdmin, upload.single('image'), validate(createGreetingSchema), createGreeting);
router.patch('/:id', protect, authorizeAdmin, upload.single('image'), validate(updateGreetingSchema), updateGreeting);
router.delete('/:id', protect, authorizeAdmin, deleteGreeting);

export default router;
