import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { user, token } = await authService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user, token }
      });
    } catch (error) {
      logger.error('Register controller error', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { user, token } = await authService.login(req.body);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: { user, token }
      });
    } catch (error) {
      logger.error('Login controller error', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      });
    }
  }
};