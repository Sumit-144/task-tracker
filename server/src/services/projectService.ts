import { projectRepository } from '../repositories/projectRepository';
import { PaginationParams } from '../types';
import { logger } from '../utils/logger';

export const projectService = {
  async createProject(data: { name: string; description?: string; ownerId: string }) {
    try {
      return await projectRepository.create(data);
    } catch (error) {
      logger.error('Create project service error', error);
      throw error;
    }
  },

  async getProjectById(id: string) {
    try {
      const project = await projectRepository.findById(id);
      if (!project) {
        throw new Error('Project not found');
      }
      return project;
    } catch (error) {
      logger.error('Get project service error', error);
      throw error;
    }
  },

  async getUserProjects(ownerId: string, pagination: PaginationParams) {
    try {
      return await projectRepository.findByOwner(ownerId, pagination);
    } catch (error) {
      logger.error('Get user projects service error', error);
      throw error;
    }
  },

  async updateProject(id: string, data: { name?: string; description?: string }) {
    try {
      return await projectRepository.update(id, data);
    } catch (error) {
      logger.error('Update project service error', error);
      throw error;
    }
  },

  async deleteProject(id: string) {
    try {
      return await projectRepository.delete(id);
    } catch (error) {
      logger.error('Delete project service error', error);
      throw error;
    }
  }
};