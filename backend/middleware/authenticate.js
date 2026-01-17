const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 *
 * Verifies JWT tokens and populates req.user with user information
 *
 * References:
 * - https://www.corbado.com/blog/nodejs-express-mysql-jwt-authentication-roles
 * - https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
 */

/**
 * Verify JWT token from cookies and set req.user
 *
 * Populates req.user with: { id, email, role }
 *
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token required',
    });
  }

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Set user info on request object (includes: id, email, role)
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Access token expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid access token',
      });
    }

    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token present
 *
 * Use for endpoints that work for both authenticated and anonymous users
 *
 * @param {Request} req - Express request
 * @param {Response} res - Express response
 * @param {NextFunction} next - Express next function
 */
const optionalAuth = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    // No token, but that's okay - continue without req.user
    return next();
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    // Token invalid, but don't fail - just continue without req.user
    console.warn('Optional auth token invalid:', error.message);
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
