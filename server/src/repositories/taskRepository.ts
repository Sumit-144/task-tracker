import prisma from '../config/database';
import { PaginationParams } from '../types';

export const taskRepository = {
  async create(data: {
    title: string;
    description?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    projectId: string;
    assigneeId?: string;
  }) {
    return await prisma.task.create({
      data,
      include: {
        project: {
          include: {
            owner: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  },

  async findById(id: string) {
    return await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            owner: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  },

  async findByProject(projectId: string, pagination: PaginationParams) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { projectId };
    if (pagination.search) {
      where.OR = [
        { title: { contains: pagination.search, mode: 'insensitive' } },
        { description: { contains: pagination.search, mode: 'insensitive' } }
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          assignee: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.task.count({ where })
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async findByAssignee(assigneeId: string, pagination: PaginationParams) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { assigneeId };
    if (pagination.search) {
      where.OR = [
        { title: { contains: pagination.search, mode: 'insensitive' } },
        { description: { contains: pagination.search, mode: 'insensitive' } }
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: {
            select: { id: true, name: true, owner: { select: { name: true } } }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.task.count({ where })
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async update(id: string, data: {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    assigneeId?: string;
  }) {
    return await prisma.task.update({
      where: { id },
      data,
      include: {
        project: {
          include: {
            owner: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        assignee: {
          select: { id: true, name: true, email: true }
        }
      }
    });
  },

  async delete(id: string) {
    return await prisma.task.delete({
      where: { id }
    });
  }
};