import { Router } from 'express';
import { authenticate } from '../middlewares/auth';

const router = Router();

// User profile routes would go here
router.use(authenticate);

export default router;