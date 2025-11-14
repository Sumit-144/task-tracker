import { Router } from 'express';
import { projectController } from '../controllers/projectController';
import { authenticate } from '../middlewares/auth';
import { projectOwnership } from '../middlewares/ownership';
import { validate } from '../middlewares/validation';
import { createProjectSchema, updateProjectSchema } from '../validations/project';

const router = Router();

router.use(authenticate);

router.get('/', projectController.getUserProjects);
router.post('/', validate(createProjectSchema), projectController.createProject);
router.get('/:id', projectController.getProject);
router.put('/:id', projectOwnership, validate(updateProjectSchema), projectController.updateProject);
router.delete('/:id', projectOwnership, projectController.deleteProject);

export default router;