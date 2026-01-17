const { z } = require('zod');

/**
 * Entity Validation Schemas
 *
 * Validates incoming requests for entity CRUD operations
 */

// Common validation helpers
const idSchema = z.string().min(1, 'ID is required').max(100, 'ID is too long');

const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().int().min(1, 'Page must be at least 1').max(10000, 'Page is too large')),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must not exceed 100')),
});

const sortSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      // Allow sorting by field name with optional - prefix for descending
      return /^-?[a-zA-Z_][a-zA-Z0-9_]*$/.test(val);
    },
    { message: 'Invalid sort format. Use field_name or -field_name for descending' }
  );

// Contract Metric validation
const contractMetricSchema = z.object({
  contract_name: z.string().min(1, 'Contract name is required').max(100),
  invocations: z.number().int().min(0, 'Invocations must be non-negative'),
  gas_used: z.number().min(0, 'Gas used must be non-negative'),
  status: z.enum(['active', 'inactive', 'pending', 'failed'], {
    errorMap: () => ({ message: 'Status must be one of: active, inactive, pending, failed' }),
  }),
  last_invocation: z.string().datetime().optional(),
});

// Oracle Feed validation
const oracleFeedSchema = z.object({
  feed_name: z.string().min(1, 'Feed name is required').max(100),
  source: z.string().min(1, 'Source is required').max(100),
  status: z.enum(['healthy', 'degraded', 'offline'], {
    errorMap: () => ({ message: 'Status must be one of: healthy, degraded, offline' }),
  }),
  last_update: z.string().datetime().optional(),
  confidence_score: z.number().min(0).max(100, 'Confidence score must be between 0 and 100').optional(),
});

// Token Analytics validation
const tokenAnalyticsSchema = z.object({
  token_symbol: z.string().min(1, 'Token symbol is required').max(10),
  token_name: z.string().min(1, 'Token name is required').max(100),
  price: z.number().min(0, 'Price must be non-negative'),
  market_cap: z.number().min(0, 'Market cap must be non-negative').optional(),
  volume_24h: z.number().min(0, 'Volume must be non-negative').optional(),
  change_24h: z.number().optional(),
});

// Risk Assessment validation
const riskAssessmentSchema = z.object({
  risk_type: z.string().min(1, 'Risk type is required').max(100),
  severity: z.enum(['low', 'medium', 'high', 'critical'], {
    errorMap: () => ({ message: 'Severity must be one of: low, medium, high, critical' }),
  }),
  description: z.string().min(1, 'Description is required').max(1000),
  mitigation: z.string().max(1000).optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'accepted'], {
    errorMap: () => ({ message: 'Status must be one of: open, in_progress, resolved, accepted' }),
  }),
});

// Alert validation
const alertSchema = z.object({
  alert_type: z.string().min(1, 'Alert type is required').max(100),
  severity: z.enum(['info', 'warning', 'error', 'critical'], {
    errorMap: () => ({ message: 'Severity must be one of: info, warning, error, critical' }),
  }),
  message: z.string().min(1, 'Message is required').max(1000),
  source: z.string().max(100).optional(),
  resolved: z.boolean().optional(),
  resolved_at: z.string().datetime().optional(),
});

// Treasury Operation validation
const treasuryOperationSchema = z.object({
  operation_type: z.string().min(1, 'Operation type is required').max(100),
  amount: z.number().min(0, 'Amount must be non-negative'),
  asset: z.string().min(1, 'Asset is required').max(50),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be one of: pending, completed, failed, cancelled' }),
  }),
  description: z.string().max(500).optional(),
});

// AI Action Log validation
const aiActionLogSchema = z.object({
  action_type: z.string().min(1, 'Action type is required').max(100),
  description: z.string().min(1, 'Description is required').max(1000),
  confidence: z.number().min(0).max(100, 'Confidence must be between 0 and 100').optional(),
  outcome: z.enum(['success', 'failure', 'pending', 'cancelled'], {
    errorMap: () => ({ message: 'Outcome must be one of: success, failure, pending, cancelled' }),
  }).optional(),
  metadata: z.record(z.any()).optional(),
});

// Audit Log validation
const auditLogSchema = z.object({
  user_id: z.string().max(100).optional(),
  action: z.string().min(1, 'Action is required').max(100),
  resource: z.string().min(1, 'Resource is required').max(100),
  details: z.string().max(1000).optional(),
  ip_address: z.string().regex(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, 'Invalid IP address format').optional(),
  user_agent: z.string().max(500).optional(),
});

// Generic entity validation (fallback)
const genericEntitySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  status: z.string().max(50).optional(),
  description: z.string().max(1000).optional(),
}).passthrough(); // Allow additional fields

// Entity-specific schema mapping
const entitySchemas = {
  'contract-metrics': contractMetricSchema,
  'oracle-feeds': oracleFeedSchema,
  'token-analytics': tokenAnalyticsSchema,
  'risk-assessments': riskAssessmentSchema,
  'alerts': alertSchema,
  'treasury-operations': treasuryOperationSchema,
  'ai-action-logs': aiActionLogSchema,
  'audit-logs': auditLogSchema,
};

// Get schema for entity type
const getEntitySchema = (entityType) => {
  return entitySchemas[entityType] || genericEntitySchema;
};

module.exports = {
  idSchema,
  paginationSchema,
  sortSchema,
  contractMetricSchema,
  oracleFeedSchema,
  tokenAnalyticsSchema,
  riskAssessmentSchema,
  alertSchema,
  treasuryOperationSchema,
  aiActionLogSchema,
  auditLogSchema,
  genericEntitySchema,
  getEntitySchema,
};
