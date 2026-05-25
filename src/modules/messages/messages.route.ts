import { Router } from 'express';
import { sendMessage, getMessages, markMessageRead, deleteMessage } from './messages.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { sendMessageSchema } from './messages.validation';

const router = Router();

router.post('/', validate(sendMessageSchema), sendMessage);
router.get('/', protect, authorizeAdmin, getMessages);
router.patch('/:id/read', protect, authorizeAdmin, markMessageRead);
router.delete('/:id', protect, authorizeAdmin, deleteMessage);

export default router;
