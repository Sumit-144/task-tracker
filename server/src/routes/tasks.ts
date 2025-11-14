import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { authenticate } from '../middlewares/auth';
import { projectOwnership, taskOwnership } from '../middlewares/ownership';
import { validate } from '../middlewares/validation';
import { createTaskSchema, updateTaskSchema } from '../validations/task';

const router = Router();

router.use(authenticate);

router.get('/', taskController.getUserTasks);
router.get('/project/:projectId', projectOwnership, taskController.getProjectTasks);
router.post('/project/:projectId', projectOwnership, validate(createTaskSchema), taskController.createTask);
router.get('/:id', taskOwnership, taskController.getTask);
router.put('/:id', taskOwnership, validate(updateTaskSchema), taskController.updateTask);
router.delete('/:id', taskOwnership, taskController.deleteTask);

export default router;