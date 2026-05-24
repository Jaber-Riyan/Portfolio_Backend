import { Router } from 'express';
import { getContact, createContact, updateContact, deleteContact } from './contact.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createContactSchema, updateContactSchema } from './contact.validation';

const router = Router();

router.get('/', getContact);
router.post('/', protect, authorizeAdmin, validate(createContactSchema), createContact);
router.patch('/:id', protect, authorizeAdmin, validate(updateContactSchema), updateContact);
router.delete('/:id', protect, authorizeAdmin, deleteContact);

export default router;
