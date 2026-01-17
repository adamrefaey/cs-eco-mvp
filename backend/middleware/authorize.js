const { hasPermission, hasRoleLevel, isValidRole, getResourcePermission } = require('../config/roles');

/**
 * Authorization Middleware
 *
 * Implements Role-Based Access Control (RBAC) following OWASP guidelines.
 *
 * Key Principles:
 * - Principle of Least Privilege: Users get minimum permissions needed
 * - Defense in Depth: Authorization checks at multiple layers
 * - Fail Secure: Deny access by default, explicit allow only
 *
 * References:
 * - https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
 * - https://owasp.org/www-project-api-security/
 * - https://medium.com/@jayantchoudhary271/building-role-based-access-control-rbac-in-node-js-and-express-js-bc870ec32bdb
 */

/**
 * Check if user has required role(s)
 *
 * @param {string|string[]} allowedRoles - Single role or array of allowed roles
 * @returns {Function} Express middleware
 *
 * @example
 * router.post('/admin', requireRole('admin'), (req, res) => {...})
 * router.get('/data', requireRole(['admin', 'user']), (req, res) => {...})
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const { role } = req.user;

    // Validate user role exists
    if (!role || !isValidRole(role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid user role',
      });
    }

    // Normalize to array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Check if user's role is in allowed roles
    if (!roles.includes(role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        required: roles.length === 1 ? roles[0] : roles,
      });
    }

    // Authorization successful
    next();
  };
};

/**
 * Check if user has required permission(s)
 *
 * More granular than role-based checking
 *
 * @param {string|string[]} requiredPermissions - Single permission or array
 * @returns {Function} Express middleware
 *
 * @example
 * router.delete('/users/:id', requirePermission('users:delete'), ...)
 * router.post('/contract', requirePermission(['contracts:create', 'contracts:read']), ...)
 */
const requirePermission = (requiredPermissions) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const { role } = req.user;

    // Validate user role
    if (!role || !isValidRole(role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid user role',
      });
    }

    // Normalize to array
    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    // Check if user has ALL required permissions
    const hasAllPermissions = permissions.every((permission) =>
      hasPermission(role, permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        required: permissions,
      });
    }

    // Authorization successful
    next();
  };
};

/**
 * Check if user has ANY of the required permissions
 *
 * Less restrictive than requirePermission (OR logic instead of AND)
 *
 * @param {string[]} requiredPermissions - Array of permissions
 * @returns {Function} Express middleware
 *
 * @example
 * router.get('/dashboard', requireAnyPermission(['admin:read', 'user:read']), ...)
 */
const requireAnyPermission = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const { role } = req.user;

    if (!role || !isValidRole(role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid user role',
      });
    }

    // Check if user has ANY of the required permissions
    const hasAnyPermission = requiredPermissions.some((permission) =>
      hasPermission(role, permission)
    );

    if (!hasAnyPermission) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions',
        required: requiredPermissions,
      });
    }

    next();
  };
};

/**
 * Check if user has minimum role level
 *
 * Useful for hierarchical role checks
 *
 * @param {string} minimumRole - Minimum required role
 * @returns {Function} Express middleware
 *
 * @example
 * router.post('/settings', requireRoleLevel('user'), ...) // user or admin
 */
const requireRoleLevel = (minimumRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const { role } = req.user;

    if (!role || !isValidRole(role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid user role',
      });
    }

    // Check if user has sufficient role level
    if (!hasRoleLevel(role, minimumRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient role level',
        required: minimumRole,
      });
    }

    next();
  };
};

/**
 * Check resource-level permission based on HTTP method
 *
 * Automatically maps HTTP methods to CRUD permissions
 *
 * @param {string} resourceName - Name of the resource (e.g., 'contract-metrics')
 * @returns {Function} Express middleware
 *
 * @example
 * router.all('/contract-metrics*', requireResourceAccess('contract-metrics'))
 */
const requireResourceAccess = (resourceName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    const { role } = req.user;

    if (!role || !isValidRole(role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Invalid user role',
      });
    }

    // Map HTTP method to action
    const methodToAction = {
      GET: 'read',
      POST: 'create',
      PUT: 'update',
      PATCH: 'update',
      DELETE: 'delete',
    };

    const action = methodToAction[req.method];
    if (!action) {
      return res.status(405).json({
        error: 'Method Not Allowed',
        message: `HTTP method ${req.method} is not supported`,
      });
    }

    // Get required permission for this resource and action
    const requiredPermission = getResourcePermission(resourceName, action);

    // If no permission defined, deny access (fail secure)
    if (!requiredPermission) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'This action is not permitted on this resource',
      });
    }

    // Check if user has the required permission
    if (!hasPermission(role, requiredPermission)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Insufficient permissions for this action',
        required: requiredPermission,
      });
    }

    next();
  };
};

/**
 * Check object-level authorization
 *
 * Ensures user can only access/modify their own resources
 * OWASP: Object-level authorization checks should be in every function
 *
 * @param {Function} ownershipCheck - Async function to check ownership
 * @returns {Function} Express middleware
 *
 * @example
 * const checkOwnership = async (req) => {
 *   const resource = await getResource(req.params.id);
 *   return resource.user_id === req.user.id;
 * };
 * router.put('/resource/:id', requireOwnership(checkOwnership), ...)
 */
const requireOwnership = (ownershipCheck) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Admins bypass ownership checks
    if (req.user.role === 'admin') {
      return next();
    }

    try {
      const isOwner = await ownershipCheck(req);

      if (!isOwner) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'You can only access your own resources',
        });
      }

      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to verify resource ownership',
      });
    }
  };
};

/**
 * Combine multiple authorization checks (AND logic)
 *
 * All checks must pass for authorization to succeed
 *
 * @param {Function[]} checks - Array of authorization middleware
 * @returns {Function} Express middleware
 *
 * @example
 * router.post('/critical', combineChecks([
 *   requireRole('admin'),
 *   requirePermission('system:critical')
 * ]), ...)
 */
const combineChecks = (checks) => {
  return (req, res, next) => {
    const runChecks = (index) => {
      if (index >= checks.length) {
        return next(); // All checks passed
      }

      checks[index](req, res, (err) => {
        if (err) {
          return next(err); // Check failed
        }
        runChecks(index + 1); // Continue to next check
      });
    };

    runChecks(0);
  };
};

module.exports = {
  requireRole,
  requirePermission,
  requireAnyPermission,
  requireRoleLevel,
  requireResourceAccess,
  requireOwnership,
  combineChecks,
};
