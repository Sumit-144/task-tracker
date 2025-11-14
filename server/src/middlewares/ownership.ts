import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/database';
import { logger } from '../utils/logger';

export const projectOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.id;
    const userId = req.user?.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.ownerId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied. Not project owner.' });
    }

    next();
  } catch (error) {
    logger.error('Ownership check error', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const taskOwnership = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const taskId = req.params.id;
    const userId = req.user?.id;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Allow access if user is project owner or task assignee
    if (task.project.ownerId !== userId && task.assigneeId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    next();
  } catch (error) {
    logger.error('Task ownership check error', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};