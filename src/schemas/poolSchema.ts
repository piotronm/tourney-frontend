import { z } from 'zod';

/**
 * Pool Validation Schema
 * Zod schema for validating pool creation and updates
 */

export const poolSchema = z.object({
  name: z.string()
    .min(1, 'Pool name is required')
    .max(50, 'Pool name must be less than 50 characters'),

  label: z.string()
    .length(1, 'Pool label must be exactly 1 character')
    .regex(/^[A-Z]$/, 'Pool label must be a single uppercase letter'),

  orderIndex: z.number()
    .int('Order must be a whole number')
    .min(1, 'Order must be at least 1')
    .max(100, 'Order must be less than 100'),
});

export const createPoolSchema = poolSchema;
export const updatePoolSchema = poolSchema.partial();

export type PoolFormData = z.infer<typeof poolSchema>;
