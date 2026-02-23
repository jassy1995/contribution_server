import { z } from 'zod';

export const TransactionType = {
  DEBIT: 'debit',
  CREDIT: 'credit',
} as const;

export const createTransactionSchema = z.object({
  description: z.string().min(1),
  type: z.enum(Object.values(TransactionType) as [string, ...string[]]),
  transactionDate: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
  transactionAmount: z.number().min(0),
});

export const updateTransactionSchema = z.object({
  description: z.string().min(1).optional(),
  type: z.enum(Object.values(TransactionType) as [string, ...string[]]).optional(),
  transactionDate: z
    .preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date())
    .optional(),
  transactionAmount: z.number().min(0).optional(),
});

export const getTransactionSchema = z.object({
  type: z.enum(Object.values(TransactionType) as [string, ...string[]]).optional(),
  search: z.string().optional(),
  month: z
    .preprocess(
      (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
      z.number().int().min(1).max(12),
    )
    .optional(),
  year: z
    .preprocess(
      (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
      z.number().int().min(1970),
    )
    .optional(),
  page: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().positive().optional(),
  ),
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().positive().optional(),
  ),
});

export type CreateTransactionBody = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionBody = z.infer<typeof updateTransactionSchema>;
export type GetTransactionParams = z.infer<typeof getTransactionSchema>;
