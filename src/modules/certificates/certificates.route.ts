import { Router } from 'express';
import { getCertificates, createCertificate, updateCertificate, deleteCertificate } from './certificates.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createCertificateSchema, updateCertificateSchema } from './certificates.validation';

const router = Router();

router.get('/', getCertificates);
router.post('/', protect, authorizeAdmin, validate(createCertificateSchema), createCertificate);
router.patch('/:id', protect, authorizeAdmin, validate(updateCertificateSchema), updateCertificate);
router.delete('/:id', protect, authorizeAdmin, deleteCertificate);

export default router;
