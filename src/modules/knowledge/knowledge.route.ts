import { Router } from 'express';
import { triggerFullSync, getStats } from './knowledge.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';

const router = Router();

// Admin-only endpoints to manage the RAG knowledge base
router.get('/stats', protect, authorizeAdmin, getStats);
router.post('/sync', protect, authorizeAdmin, triggerFullSync);

export default router;
