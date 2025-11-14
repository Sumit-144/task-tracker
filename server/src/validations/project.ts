import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional()
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Project name is required').optional(),
    description: z.string().optional()
  })
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>['body'];
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>['body'];