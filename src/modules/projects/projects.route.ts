import { Router } from 'express';
import { getProjects, createProject, updateProject, deleteProject, reorderProjects } from './projects.controller';
import { protect, authorizeAdmin } from '../../shared/middleware/auth';
import { validate } from '../../shared/middleware/validate';
import { createProjectSchema, updateProjectSchema, reorderSchema } from './projects.validation';
import { uploaders } from '../../core/storage/multer';

const router = Router();
const upload = uploaders.projects;

router.get('/', getProjects);
router.post('/', protect, authorizeAdmin, upload.single('image'), validate(createProjectSchema), createProject);
router.patch('/reorder', protect, authorizeAdmin, validate(reorderSchema), reorderProjects);
router.patch('/:id', protect, authorizeAdmin, upload.single('image'), validate(updateProjectSchema), updateProject);
router.delete('/:id', protect, authorizeAdmin, deleteProject);

export default router;
