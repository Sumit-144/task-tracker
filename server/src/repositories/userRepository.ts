import prisma from '../config/database';
import { RegisterUser } from '../types';

export const userRepository = {
  async create(userData: RegisterUser) {
    return await prisma.user.create({
      data: userData,
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  },

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email }
    });
  },

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  },

  async update(id: string, data: { name?: string; password?: string }) {
    return await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
  }
};