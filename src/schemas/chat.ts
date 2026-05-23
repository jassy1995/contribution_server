import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1),
  chatId: z.string().optional(),
});

export type ChatBody = z.infer<typeof chatSchema>;