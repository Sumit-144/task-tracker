import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { logger } from '../utils/logger';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      next();
    } catch (error) {
      logger.error('Validation error', error);
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      });
    }
  };
};