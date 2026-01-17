/**
 * Role and Permission Configuration
 *
 * Centralized role and permission management following RBAC best practices.
 *
 * References:
 * - https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
 * - https://medium.com/@jayantchoudhary271/building-role-based-access-control-rbac-in-node-js-and-express-js-bc870ec32bdb
 * - https://www.corbado.com/blog/nodejs-express-mysql-jwt-authentication-roles
 */

/**
 * System Roles
 *
 * Following the Principle of Least Privilege:
 * - Assign users only the minimum privileges necessary to complete their job
 * - Roles are hierarchical (admin > user > viewer)
 */
const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer',
};

/**
 * System Permissions (Actions)
 *
 * Granular permissions that can be assigned to roles
 */
const PERMISSIONS = {
  // User Management
  USERS_CREATE: 'users:create',
  USERS_READ: 'users:read',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Contract Metrics
  CONTRACTS_CREATE: 'contracts:create',
  CONTRACTS_READ: 'contracts:read',
  CONTRACTS_UPDATE: 'contracts:update',
  CONTRACTS_DELETE: 'contracts:delete',

  // Oracle Feeds
  ORACLES_CREATE: 'oracles:create',
  ORACLES_READ: 'oracles:read',
  ORACLES_UPDATE: 'oracles:update',
  ORACLES_DELETE: 'oracles:delete',

  // Token Analytics
  TOKENS_CREATE: 'tokens:create',
  TOKENS_READ: 'tokens:read',
  TOKENS_UPDATE: 'tokens:update',
  TOKENS_DELETE: 'tokens:delete',

  // Risk Assessments
  RISKS_CREATE: 'risks:create',
  RISKS_READ: 'risks:read',
  RISKS_UPDATE: 'risks:update',
  RISKS_DELETE: 'risks:delete',

  // Alerts
  ALERTS_CREATE: 'alerts:create',
  ALERTS_READ: 'alerts:read',
  ALERTS_UPDATE: 'alerts:update',
  ALERTS_DELETE: 'alerts:delete',

  // Treasury Operations
  TREASURY_CREATE: 'treasury:create',
  TREASURY_READ: 'treasury:read',
  TREASURY_UPDATE: 'treasury:update',
  TREASURY_DELETE: 'treasury:delete',

  // AI Action Logs
  AI_LOGS_CREATE: 'ai-logs:create',
  AI_LOGS_READ: 'ai-logs:read',
  AI_LOGS_UPDATE: 'ai-logs:update',
  AI_LOGS_DELETE: 'ai-logs:delete',

  // Audit Logs
  AUDIT_LOGS_READ: 'audit-logs:read',

  // System Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',
};

/**
 * Role-to-Permission Mapping
 *
 * Defines what permissions each role has
 * Uses a Set for O(1) permission checking
 */
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: new Set([
    // Full access to everything
    ...Object.values(PERMISSIONS),
  ]),

  [ROLES.USER]: new Set([
    // Users can read and manage their own data
    PERMISSIONS.CONTRACTS_CREATE,
    PERMISSIONS.CONTRACTS_READ,
    PERMISSIONS.CONTRACTS_UPDATE,

    PERMISSIONS.ORACLES_READ,

    PERMISSIONS.TOKENS_READ,

    PERMISSIONS.RISKS_CREATE,
    PERMISSIONS.RISKS_READ,
    PERMISSIONS.RISKS_UPDATE,

    PERMISSIONS.ALERTS_READ,
    PERMISSIONS.ALERTS_UPDATE,

    PERMISSIONS.TREASURY_READ,

    PERMISSIONS.AI_LOGS_CREATE,
    PERMISSIONS.AI_LOGS_READ,

    PERMISSIONS.SETTINGS_READ,
  ]),

  [ROLES.VIEWER]: new Set([
    // Viewers can only read data
    PERMISSIONS.CONTRACTS_READ,
    PERMISSIONS.ORACLES_READ,
    PERMISSIONS.TOKENS_READ,
    PERMISSIONS.RISKS_READ,
    PERMISSIONS.ALERTS_READ,
    PERMISSIONS.TREASURY_READ,
    PERMISSIONS.AI_LOGS_READ,
    PERMISSIONS.SETTINGS_READ,
  ]),
};

/**
 * Resource-to-Permission Mapping
 *
 * Maps REST operations to required permissions
 */
const RESOURCE_PERMISSIONS = {
  'contract-metrics': {
    create: PERMISSIONS.CONTRACTS_CREATE,
    read: PERMISSIONS.CONTRACTS_READ,
    update: PERMISSIONS.CONTRACTS_UPDATE,
    delete: PERMISSIONS.CONTRACTS_DELETE,
  },
  'oracle-feeds': {
    create: PERMISSIONS.ORACLES_CREATE,
    read: PERMISSIONS.ORACLES_READ,
    update: PERMISSIONS.ORACLES_UPDATE,
    delete: PERMISSIONS.ORACLES_DELETE,
  },
  'token-analytics': {
    create: PERMISSIONS.TOKENS_CREATE,
    read: PERMISSIONS.TOKENS_READ,
    update: PERMISSIONS.TOKENS_UPDATE,
    delete: PERMISSIONS.TOKENS_DELETE,
  },
  'risk-assessments': {
    create: PERMISSIONS.RISKS_CREATE,
    read: PERMISSIONS.RISKS_READ,
    update: PERMISSIONS.RISKS_UPDATE,
    delete: PERMISSIONS.RISKS_DELETE,
  },
  'alerts': {
    create: PERMISSIONS.ALERTS_CREATE,
    read: PERMISSIONS.ALERTS_READ,
    update: PERMISSIONS.ALERTS_UPDATE,
    delete: PERMISSIONS.ALERTS_DELETE,
  },
  'treasury-operations': {
    create: PERMISSIONS.TREASURY_CREATE,
    read: PERMISSIONS.TREASURY_READ,
    update: PERMISSIONS.TREASURY_UPDATE,
    delete: PERMISSIONS.TREASURY_DELETE,
  },
  'ai-action-logs': {
    create: PERMISSIONS.AI_LOGS_CREATE,
    read: PERMISSIONS.AI_LOGS_READ,
    update: PERMISSIONS.AI_LOGS_UPDATE,
    delete: PERMISSIONS.AI_LOGS_DELETE,
  },
  'audit-logs': {
    create: null, // System-only
    read: PERMISSIONS.AUDIT_LOGS_READ,
    update: null, // Immutable
    delete: null, // Immutable
  },
};

/**
 * Check if a role has a specific permission
 *
 * @param {string} role - User role
 * @param {string} permission - Required permission
 * @returns {boolean} - Whether role has permission
 */
const hasPermission = (role, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[role];
  if (!rolePermissions) {
    return false;
  }
  return rolePermissions.has(permission);
};

/**
 * Get all permissions for a role
 *
 * @param {string} role - User role
 * @returns {Set<string>} - Set of permissions
 */
const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || new Set();
};

/**
 * Get required permission for a resource and action
 *
 * @param {string} resource - Resource name (e.g., 'contract-metrics')
 * @param {string} action - Action (create, read, update, delete)
 * @returns {string|null} - Required permission or null if not defined
 */
const getResourcePermission = (resource, action) => {
  const resourcePerms = RESOURCE_PERMISSIONS[resource];
  if (!resourcePerms) {
    return null;
  }
  return resourcePerms[action] || null;
};

/**
 * Validate if a role exists
 *
 * @param {string} role - Role to validate
 * @returns {boolean} - Whether role is valid
 */
const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};

/**
 * Get role hierarchy level (for comparison)
 * Higher number = more privileges
 *
 * @param {string} role - Role to check
 * @returns {number} - Hierarchy level
 */
const getRoleLevel = (role) => {
  const levels = {
    [ROLES.VIEWER]: 1,
    [ROLES.USER]: 2,
    [ROLES.ADMIN]: 3,
  };
  return levels[role] || 0;
};

/**
 * Check if one role has higher or equal privileges than another
 *
 * @param {string} userRole - User's role
 * @param {string} requiredRole - Required role
 * @returns {boolean} - Whether user role is sufficient
 */
const hasRoleLevel = (userRole, requiredRole) => {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
};

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  RESOURCE_PERMISSIONS,
  hasPermission,
  getRolePermissions,
  getResourcePermission,
  isValidRole,
  getRoleLevel,
  hasRoleLevel,
};
