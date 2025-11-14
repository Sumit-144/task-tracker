import { taskRepository } from '../repositories/taskRepository';
import { PaginationParams } from '../types';
import { logger } from '../utils/logger';

export const taskService = {
  async createTask(data: {
    title: string;
    description?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    projectId: string;
    assigneeId?: string;
  }) {
    try {
      return await taskRepository.create(data);
    } catch (error) {
      logger.error('Create task service error', error);
      throw error;
    }
  },

  async getTaskById(id: string) {
    try {
      const task = await taskRepository.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error) {
      logger.error('Get task service error', error);
      throw error;
    }
  },

  async getProjectTasks(projectId: string, pagination: PaginationParams) {
    try {
      return await taskRepository.findByProject(projectId, pagination);
    } catch (error) {
      logger.error('Get project tasks service error', error);
      throw error;
    }
  },

  async getUserTasks(assigneeId: string, pagination: PaginationParams) {
    try {
      return await taskRepository.findByAssignee(assigneeId, pagination);
    } catch (error) {
      logger.error('Get user tasks service error', error);
      throw error;
    }
  },

  async updateTask(id: string, data: {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    assigneeId?: string;
  }) {
    try {
      return await taskRepository.update(id, data);
    } catch (error) {
      logger.error('Update task service error', error);
      throw error;
    }
  },

  async deleteTask(id: string) {
    try {
      return await taskRepository.delete(id);
    } catch (error) {
      logger.error('Delete task service error', error);
      throw error;
    }
  }
};