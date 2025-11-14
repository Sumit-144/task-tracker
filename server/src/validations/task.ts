import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).default('PENDING'),
    assigneeId: z.string().uuid('Invalid assignee ID').optional()
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
    assigneeId: z.string().uuid('Invalid assignee ID').optional()
  })
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];