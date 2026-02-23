import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string(),
  target: z.number().min(0).default(0),
  image: z.instanceof(File).optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  target: z.number().min(0).default(0),
  image: z.instanceof(File).optional(),
});

export interface CreateCategoryBody extends z.infer<typeof createCategorySchema> {
  slug: string;
}

export interface UpdateCategoryBody extends z.infer<typeof updateCategorySchema> {}
