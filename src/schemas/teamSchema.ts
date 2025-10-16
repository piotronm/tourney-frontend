import { z } from 'zod';

/**
 * Team form validation schema
 *
 * Rules:
 * - Name: Required, 3-50 characters, trimmed
 * - Pool ID: Optional, must be valid number or empty
 * - Pool Seed: Optional, must be positive integer
 */
export const teamSchema = z.object({
  name: z
    .string()
    .min(1, 'Team name is required')
    .min(3, 'Team name must be at least 3 characters')
    .max(50, 'Team name must not exceed 50 characters')
    .trim()
    .transform((val) => val.replace(/\s+/g, ' ')), // Normalize whitespace

  poolId: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === '' || !isNaN(Number(val)),
      'Pool ID must be a valid number'
    ),

  poolSeed: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === '' || (Number(val) > 0 && Number.isInteger(Number(val))),
      'Pool seed must be a positive integer'
    ),
});

/**
 * Infer TypeScript type from schema
 */
export type TeamFormData = z.infer<typeof teamSchema>;

/**
 * CSV import validation schema
 */
export const teamCsvSchema = z.object({
  name: z.string().min(3).max(50),
  pool: z.string().optional(),
  seed: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    'Seed must be a number'
  ),
});
