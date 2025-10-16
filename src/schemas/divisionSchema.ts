import { z } from 'zod';

/**
 * Division form validation schema
 *
 * Rules:
 * - Name: Required, 3-100 characters, trimmed
 */
export const divisionSchema = z.object({
  name: z
    .string()
    .min(1, 'Division name is required')
    .min(3, 'Division name must be at least 3 characters')
    .max(100, 'Division name must not exceed 100 characters')
    .trim()
    .transform((val) => val.replace(/\s+/g, ' ')), // Normalize whitespace
});

/**
 * Infer TypeScript type from schema
 * This ensures form data matches validation rules
 */
export type DivisionFormData = z.infer<typeof divisionSchema>;
