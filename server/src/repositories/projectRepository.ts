import prisma from '../config/database';
import { PaginationParams } from '../types';

export const projectRepository = {
  async create(data: { name: string; description?: string; ownerId: string }) {
    return await prisma.project.create({
      data,
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
  },

  async findById(id: string) {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  },

  async findByOwner(ownerId: string, pagination: PaginationParams) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { ownerId };
    if (pagination.search) {
      where.name = { contains: pagination.search, mode: 'insensitive' };
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          owner: {
            select: { id: true, name: true, email: true }
          },
          tasks: {
            select: { id: true }
          },
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.project.count({ where })
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async update(id: string, data: { name?: string; description?: string }) {
    return await prisma.project.update({
      where: { id },
      data,
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true }
            }
          }
        }
      }
    });
  },

  async delete(id: string) {
    return await prisma.project.delete({
      where: { id }
    });
  }
};