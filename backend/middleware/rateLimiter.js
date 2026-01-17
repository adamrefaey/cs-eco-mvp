const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Middleware
 *
 * Implements rate limiting to protect against brute force attacks, DDoS,
 * and API abuse following OWASP API Security 2023 guidelines.
 *
 * References:
 * - https://www.npmjs.com/package/express-rate-limit
 * - https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/
 * - https://betterstack.com/community/guides/scaling-nodejs/rate-limiting-express/
 */

/**
 * Create a custom error message with Retry-After header
 */
const createRateLimitMessage = (req, res) => {
  const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);

  return {
    error: 'Too many requests',
    message: `You have exceeded the rate limit. Please try again in ${retryAfter} seconds.`,
    retryAfter,
    limit: req.rateLimit.limit,
    remaining: req.rateLimit.remaining,
    resetTime: new Date(req.rateLimit.resetTime).toISOString(),
  };
};

/**
 * Rate limit handler - sends 429 with details
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json(createRateLimitMessage(req, res));
};

/**
 * Skip successful requests - only count failed attempts for auth endpoints
 * This prevents legitimate users from being rate limited
 */
const skipSuccessfulRequests = (req, res) => {
  // Only count failed attempts (4xx and 5xx status codes)
  return res.statusCode < 400;
};

/**
 * Get client identifier - uses IP address
 * In production, you might want to use user ID for authenticated requests
 */
const keyGenerator = (req) => {
  // Use X-Forwarded-For if behind a proxy, otherwise use req.ip
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;
  return ip;
};

// =============================================================================
// AUTHENTICATION RATE LIMITERS (Strict - Prevent Brute Force)
// =============================================================================

/**
 * Login Rate Limiter - STRICT
 *
 * Protects against brute force password attacks
 * - 5 attempts per 15 minutes per IP
 * - Counted only on failed login attempts
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: 'draft-8', // Use combined RateLimit header (2026 standard)
  legacyHeaders: false, // Disable X-RateLimit-* headers
  skipSuccessfulRequests: true, // Only count failed logins
  keyGenerator,
  handler: rateLimitHandler,
  validate: { ipv6SubnetOrKeyGenerator: false }, // Disable IPv6 check for custom keyGenerator
});

/**
 * Registration Rate Limiter - VERY STRICT
 *
 * Prevents mass account creation and spam
 * - 3 attempts per hour per IP
 */
const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per window
  message: 'Too many registration attempts from this IP, please try again after an hour',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all registration attempts
  keyGenerator,
  handler: rateLimitHandler,
  validate: { ipv6SubnetOrKeyGenerator: false },
});

/**
 * Password Reset Rate Limiter - STRICT
 *
 * Prevents password reset abuse and enumeration attacks
 * - 3 attempts per hour per IP
 */
const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per window
  message: 'Too many password reset attempts, please try again after an hour',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator,
  handler: rateLimitHandler,
  validate: { ipv6SubnetOrKeyGenerator: false },
});

/**
 * Token Refresh Rate Limiter - MODERATE
 *
 * Prevents token refresh abuse
 * - 10 attempts per 15 minutes per IP
 */
const refreshTokenRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: 'Too many token refresh attempts, please try again later',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator,
  handler: rateLimitHandler,
  validate: { ipv6SubnetOrKeyGenerator: false },
});

// =============================================================================
// API RATE LIMITERS (Moderate - Normal Usage Protection)
// =============================================================================

/**
 * General API Rate Limiter - MODERATE
 *
 * Protects API endpoints from abuse while allowing normal usage
 * - 100 requests per 15 minutes per IP
 */
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many API requests from this IP, please try again later',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator,
  handler: rateLimitHandler,
  validate: { ipv6SubnetOrKeyGenerator: false },
});

/**
 * Authenticated API Rate Limiter - LENIENT
 *
 * More lenient for authenticated users
 * - 300 requests per 15 minutes per user
 *
 * Note: Uses user ID if available, falls back to IP
 */
const authenticatedApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  message: 'Too many API requests, please try again later',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    // Use user ID from JWT if available, otherwise use IP
    return req.user?.id || keyGenerator(req);
  },
  handler: rateLimitHandler,
});

/**
 * Write Operations Rate Limiter - MODERATE
 *
 * Stricter limits for POST/PUT/DELETE operations
 * - 50 requests per 15 minutes per IP
 */
const writeOperationsRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: 'Too many write operations, please try again later',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator,
  handler: rateLimitHandler,
  validate: { ipv6SubnetOrKeyGenerator: false },
});

// =============================================================================
// PUBLIC ENDPOINT RATE LIMITERS (Lenient - Allow High Traffic)
// =============================================================================

/**
 * Public Endpoint Rate Limiter - LENIENT
 *
 * For public endpoints that need higher limits
 * - 1000 requests per 15 minutes per IP
 */
const publicRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: 'Too many requests, please try again later',
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator,
  handler: rateLimitHandler,
  validate: { ipv6SubnetOrKeyGenerator: false },
});

/**
 * Health Check Rate Limiter - VERY LENIENT
 *
 * For monitoring and health check endpoints
 * - 10000 requests per 15 minutes per IP
 */
const healthCheckRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // 10000 requests per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator,
  handler: rateLimitHandler,
  validate: { ipv6SubnetOrKeyGenerator: false },
});

// =============================================================================
// COMPOSITE RATE LIMITERS (Multiple Windows)
// =============================================================================

/**
 * Create a composite rate limiter with multiple time windows
 * Useful for detecting burst attacks vs sustained attacks
 *
 * Example: Limit to 5 per minute AND 20 per hour
 */
const createCompositeRateLimiter = (shortWindow, longWindow) => {
  return [shortWindow, longWindow];
};

/**
 * Strict Composite Limiter for Critical Endpoints
 * - 5 requests per minute
 * - 20 requests per hour
 */
const criticalEndpointRateLimiter = [
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator,
    handler: rateLimitHandler,
    validate: { ipv6SubnetOrKeyGenerator: false },
  }),
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator,
    handler: rateLimitHandler,
    validate: { ipv6SubnetOrKeyGenerator: false },
  }),
];

// =============================================================================
// EXPORTS
// =============================================================================

module.exports = {
  // Authentication limiters
  loginRateLimiter,
  registerRateLimiter,
  passwordResetRateLimiter,
  refreshTokenRateLimiter,

  // API limiters
  apiRateLimiter,
  authenticatedApiRateLimiter,
  writeOperationsRateLimiter,

  // Public limiters
  publicRateLimiter,
  healthCheckRateLimiter,

  // Composite limiters
  criticalEndpointRateLimiter,
  createCompositeRateLimiter,

  // Utilities
  createRateLimitMessage,
  rateLimitHandler,
  keyGenerator,
};
