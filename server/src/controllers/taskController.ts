import { Response } from 'express';
import { AuthRequest } from '../types';
import { taskService } from '../services/taskService';
import { logger } from '../utils/logger';

export const taskController = {
  async createTask(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.createTask({
        ...req.body,
        projectId: req.params.projectId
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      logger.error('Create task controller error', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create task'
      });
    }
  },

  async getTask(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      
      res.json({
        success: true,
        data: task
      });
    } catch (error) {
      logger.error('Get task controller error', error);
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Task not found'
      });
    }
  },

  async getProjectTasks(req: AuthRequest, res: Response) {
    try {
      const { page, limit, search } = req.query;
      const tasks = await taskService.getProjectTasks(req.params.projectId, {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        search: search as string
      });

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      logger.error('Get project tasks controller error', error);
      res.status(400).json({
        success: false,
        message: 'Failed to fetch tasks'
      });
    }
  },

  async getUserTasks(req: AuthRequest, res: Response) {
    try {
      const { page, limit, search } = req.query;
      const tasks = await taskService.getUserTasks(req.user!.id, {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        search: search as string
      });

      res.json({
        success: true,
        data: tasks
      });
    } catch (error) {
      logger.error('Get user tasks controller error', error);
      res.status(400).json({
        success: false,
        message: 'Failed to fetch tasks'
      });
    }
  },

  async updateTask(req: AuthRequest, res: Response) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      
      res.json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      logger.error('Update task controller error', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update task'
      });
    }
  },

  async deleteTask(req: AuthRequest, res: Response) {
    try {
      await taskService.deleteTask(req.params.id);
      
      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      logger.error('Delete task controller error', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete task'
      });
    }
  }
};