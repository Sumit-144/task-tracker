import { Router } from 'express';
import { authController } from '../controllers/authController';
import { validate } from '../middlewares/validation';
import { registerSchema, loginSchema } from '../validations/auth';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;