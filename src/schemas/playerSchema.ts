import { z } from 'zod';

/**
 * Player form validation schema
 *
 * Migration note (2025-10-23): Updated to use single name field and separate ratings
 *
 * Rules:
 * - Name: Required, 1-200 characters (full name)
 * - Email: Optional, valid email format if provided
 * - Phone: Optional, max 20 characters
 * - DUPR ID: Optional, 6 alphanumeric characters (auto-uppercase)
 * - Singles Rating: Optional, 1.0-7.0
 * - Doubles Rating: Optional, 1.0-7.0
 */
export const playerSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(200, 'Name must not exceed 200 characters')
    .trim()
    .transform((val) => val.replace(/\s+/g, ' ')), // Normalize whitespace

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

  singlesRating: z
    .union([
      z.number(),
      z.string().transform(val => val === '' ? undefined : parseFloat(val)),
      z.undefined()
    ])
    .optional()
    .refine(val => val === undefined || (val >= 1.0 && val <= 7.0), {
      message: 'Singles rating must be between 1.0 and 7.0'
    }),

  doublesRating: z
    .union([
      z.number(),
      z.string().transform(val => val === '' ? undefined : parseFloat(val)),
      z.undefined()
    ])
    .optional()
    .refine(val => val === undefined || (val >= 1.0 && val <= 7.0), {
      message: 'Doubles rating must be between 1.0 and 7.0'
    }),
});

/**
 * Infer TypeScript type from schema
 * This ensures form data matches validation rules
 */
export type PlayerFormData = z.infer<typeof playerSchema>;
