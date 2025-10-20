import { z } from 'zod';

/**
 * Player form validation schema
 *
 * Rules:
 * - Email: Optional, valid email format if provided
 * - First Name: Required, 1-100 characters
 * - Last Name: Required, 1-100 characters
 * - Phone: Optional, max 20 characters
 * - DUPR ID: Optional, 6 alphanumeric characters (auto-uppercase)
 * - DUPR Rating: Optional, 1.0-7.0
 */
export const playerSchema = z.object({
  email: z
    .string()
    .transform(val => val.trim() || undefined)
    .optional()
    .refine(val => !val || z.string().email().safeParse(val).success, {
      message: 'Invalid email address'
    })
    .refine(val => !val || val.length <= 255, {
      message: 'Email must not exceed 255 characters'
    }),

  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must not exceed 100 characters')
    .trim()
    .transform((val) => val.replace(/\s+/g, ' ')), // Normalize whitespace

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must not exceed 100 characters')
    .trim()
    .transform((val) => val.replace(/\s+/g, ' ')), // Normalize whitespace

  phone: z
    .string()
    .transform(val => val.trim() || undefined)
    .optional()
    .refine(val => !val || val.length <= 20, {
      message: 'Phone must not exceed 20 characters'
    }),

  duprId: z
    .string()
    .transform(val => val.trim() || undefined)
    .transform(val => val ? val.toUpperCase() : undefined)
    .optional()
    .refine(val => !val || /^[A-Z0-9]{6}$/.test(val), {
      message: 'DUPR ID must be 6 alphanumeric characters'
    }),

  duprRating: z
    .union([
      z.number(),
      z.string().transform(val => val === '' ? undefined : parseFloat(val)),
      z.undefined()
    ])
    .optional()
    .refine(val => val === undefined || (val >= 1.0 && val <= 7.0), {
      message: 'DUPR rating must be between 1.0 and 7.0'
    }),
});

/**
 * Infer TypeScript type from schema
 * This ensures form data matches validation rules
 */
export type PlayerFormData = z.infer<typeof playerSchema>;
