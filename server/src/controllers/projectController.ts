import { Response } from 'express';
import { AuthRequest } from '../types';
import { projectService } from '../services/projectService';
import { logger } from '../utils/logger';

export const projectController = {
  async createProject(req: AuthRequest, res: Response) {
    try {
      const project = await projectService.createProject({
        ...req.body,
        ownerId: req.user!.id
      });

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      logger.error('Create project controller error', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create project'
      });
    }
  },

  async getProject(req: AuthRequest, res: Response) {
    try {
      const project = await projectService.getProjectById(req.params.id);
      
      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      logger.error('Get project controller error', error);
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Project not found'
      });
    }
  },

  async getUserProjects(req: AuthRequest, res: Response) {
    try {
      const { page, limit, search } = req.query;
      const projects = await projectService.getUserProjects(req.user!.id, {
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 10,
        search: search as string
      });

      res.json({
        success: true,
        data: projects
      });
    } catch (error) {
      logger.error('Get user projects controller error', error);
      res.status(400).json({
        success: false,
        message: 'Failed to fetch projects'
      });
    }
  },

  async updateProject(req: AuthRequest, res: Response) {
    try {
      const project = await projectService.updateProject(req.params.id, req.body);
      
      res.json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      logger.error('Update project controller error', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update project'
      });
    }
  },

  async deleteProject(req: AuthRequest, res: Response) {
    try {
      await projectService.deleteProject(req.params.id);
      
      res.json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      logger.error('Delete project controller error', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete project'
      });
    }
  }
};