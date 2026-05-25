import { Router } from 'express';
import { getReviews, createReview, updateReview, deleteReview } from './reviews.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createReviewSchema, updateReviewSchema } from './reviews.validation';
import { upload } from '../../middleware/upload';

const router = Router();

router.get('/', getReviews);
router.post('/', protect, authorizeAdmin, upload.single('avatar'), validate(createReviewSchema), createReview);
router.patch('/:id', protect, authorizeAdmin, upload.single('avatar'), validate(updateReviewSchema), updateReview);
router.delete('/:id', protect, authorizeAdmin, deleteReview);

export default router;
