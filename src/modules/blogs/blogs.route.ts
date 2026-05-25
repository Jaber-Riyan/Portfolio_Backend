import { Router } from 'express';
import { getBlogs, createBlog, updateBlog, deleteBlog, togglePublish } from './blogs.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createBlogSchema, updateBlogSchema } from './blogs.validation';
import { upload } from '../../middleware/upload';

const router = Router();

router.get('/', getBlogs);
router.post('/', protect, authorizeAdmin, upload.single('image'), validate(createBlogSchema), createBlog);
router.patch('/publish/:id', protect, authorizeAdmin, togglePublish);
router.patch('/:id', protect, authorizeAdmin, upload.single('image'), validate(updateBlogSchema), updateBlog);
router.delete('/:id', protect, authorizeAdmin, deleteBlog);

export default router;
