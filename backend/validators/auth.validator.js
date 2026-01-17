const { z } = require('zod');

/**
 * Authentication Validation Schemas
 *
 * These schemas validate incoming requests for authentication endpoints
 * using Zod for type-safe, comprehensive validation.
 */

// Email validation helper
const emailSchema = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .email('Invalid email format')
  .min(3, 'Email must be at least 3 characters')
  .max(255, 'Email must not exceed 255 characters')
  .toLowerCase()
  .trim();

// Password validation helper
const passwordSchema = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

// Full name validation helper
const fullNameSchema = z
  .string({
    required_error: 'Full name is required',
    invalid_type_error: 'Full name must be a string',
  })
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name must not exceed 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes')
  .trim();

// Login validation schema
const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'), // Less strict for login
});

// Registration validation schema
const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: fullNameSchema,
});

// Google authentication validation schema
const googleAuthSchema = z.object({
  idToken: z
    .string({
      required_error: 'Google ID token is required',
      invalid_type_error: 'ID token must be a string',
    })
    .min(1, 'Google ID token cannot be empty')
    .max(5000, 'Google ID token is too long'),
});

// Password change schema (future use)
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Email update schema (future use)
const updateEmailSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required for email change'),
});

// Profile update schema (future use)
const updateProfileSchema = z.object({
  full_name: fullNameSchema.optional(),
  avatar_url: z.string().url('Invalid avatar URL').optional(),
});

module.exports = {
  loginSchema,
  registerSchema,
  googleAuthSchema,
  changePasswordSchema,
  updateEmailSchema,
  updateProfileSchema,
};
