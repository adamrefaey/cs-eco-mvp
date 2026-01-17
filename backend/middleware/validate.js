const { ZodError } = require('zod');

/**
 * Validation Middleware
 *
 * Creates middleware to validate request data against Zod schemas
 * Supports validating body, query params, and URL params
 */

/**
 * Format Zod validation errors into user-friendly format
 *
 * In Zod v4, use error.issues instead of error.errors
 * Reference: https://github.com/colinhacks/zod/issues/5063
 */
const formatZodError = (error) => {
  // Check if it's a Zod error with the issues array (Zod v3+)
  if (error instanceof ZodError && Array.isArray(error.issues)) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join('.') || 'unknown',
      message: issue.message,
      code: issue.code,
    }));

    return {
      message: 'Validation failed',
      errors,
    };
  }

  // Fallback for non-Zod errors
  return {
    message: 'Validation failed',
    errors: [{
      field: 'unknown',
      message: error?.message || 'Invalid input',
      code: 'invalid'
    }],
  };
};

/**
 * Create validation middleware for request body
 *
 * Uses safeParse() to avoid try-catch blocks (best practice)
 * Reference: https://zod.dev/basics
 *
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formattedError = formatZodError(result.error);
      return res.status(400).json(formattedError);
    }

    req.body = result.data; // Replace with validated data (with transformations applied)
    next();
  };
};

/**
 * Create validation middleware for query parameters
 *
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const formattedError = formatZodError(result.error);
      return res.status(400).json(formattedError);
    }

    req.query = result.data;
    next();
  };
};

/**
 * Create validation middleware for URL parameters
 *
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const formattedError = formatZodError(result.error);
      return res.status(400).json(formattedError);
    }

    req.params = result.data;
    next();
  };
};

/**
 * Validate multiple parts of the request
 *
 * @param {Object} schemas - Object with keys: body, query, params
 * @returns {Function} Express middleware function
 */
const validate = (schemas) => {
  return (req, res, next) => {
    const errors = [];

    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        errors.push(...result.error.issues);
      } else {
        req.body = result.data;
      }
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        errors.push(...result.error.issues);
      } else {
        req.query = result.data;
      }
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        errors.push(...result.error.issues);
      } else {
        req.params = result.data;
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      });
    }

    next();
  };
};

/**
 * Async validation wrapper (for async schema transformations)
 */
const validateAsync = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const data = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      const validated = await schema.parseAsync(data);

      if (source === 'body') {
        req.body = validated;
      } else if (source === 'query') {
        req.query = validated;
      } else {
        req.params = validated;
      }

      next();
    } catch (error) {
      const formattedError = formatZodError(error);
      return res.status(400).json(formattedError);
    }
  };
};

module.exports = {
  validateBody,
  validateQuery,
  validateParams,
  validate,
  validateAsync,
  formatZodError,
};
