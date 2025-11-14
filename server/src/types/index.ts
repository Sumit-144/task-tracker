import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface CreateProject {
  name: string;
  description?: string;
  ownerId: string;
}

export interface CreateTask {
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  projectId: string;
  assigneeId?: string;
}

export interface UpdateTask {
  title?: string;
  description?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assigneeId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DecodedToken extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}