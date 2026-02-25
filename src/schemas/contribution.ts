import { z } from 'zod';
import { ContributionStatus } from '../config/constants';

export const createContributionSchema = z.object({
  amount: z.number().min(0),
  fined: z.number().min(0).optional(),
  collectedAt: z.preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date()),
  status: z
    .enum(Object.values(ContributionStatus) as [string, ...string[]])
    .default(ContributionStatus.PENDING),
  category: z.string(),
  contributor: z.string(),
});

export const updateContributionSchema = z.object({
  amount: z.number().min(0).optional(),
  fined: z.number().min(0).optional(),
  collectedAt: z
    .preprocess((val) => (typeof val === 'string' ? new Date(val) : val), z.date())
    .optional(),
  status: z.enum(Object.values(ContributionStatus) as [string, ...string[]]).optional(),
});

export const getContributionSchema = z.object({
  category: z.string().optional(),
  status: z.enum(Object.values(ContributionStatus) as [string, ...string[]]).optional(),
  page: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().positive().optional(),
  ),
  limit: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().positive().optional(),
  ),
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
});

export type CreateContributionBody = z.infer<typeof createContributionSchema>;
export type UpdateContributionBody = z.infer<typeof updateContributionSchema>;
export type GetContributionParams = z.infer<typeof getContributionSchema>;
