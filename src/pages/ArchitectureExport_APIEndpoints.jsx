import React from "react";
import { Download, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function APIEndpointsExport() {
  const apiSpec = `/**
 * Lumanagi REST API Specification
 * Base URL: http://localhost:3001/api
 * Authentication: JWT Bearer Token
 * 
 * Run backend: npm run dev
 */

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * POST /api/auth/register
 * Register new user
 */
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
// Response: { user, access_token, refresh_token }

/**
 * POST /api/auth/login
 * Login user
 */
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
// Response: { user, access_token, refresh_token }

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
// Response: { access_token }

/**
 * POST /api/auth/logout
 * Logout user (invalidate refresh token)
 */
// Headers: Authorization: Bearer <token>
// Response: { message: "Logged out successfully" }

/**
 * GET /api/auth/me
 * Get current user
 */
// Headers: Authorization: Bearer <token>
// Response: { user }

/**
 * PATCH /api/auth/me
 * Update current user
 */
// Headers: Authorization: Bearer <token>
{
  "full_name": "Jane Doe",
  "settings": { "theme": "dark", "aiSuggestionLevel": "balanced" }
}
// Response: { user }

// ============================================
// CONTRACT METRICS ENDPOINTS
// ============================================

/**
 * GET /api/contracts
 * List all contracts
 * Query params: ?limit=20&offset=0&status=HEALTHY
 */
// Response: { data: Contract[], total: number }

/**
 * GET /api/contracts/:id
 * Get single contract
 */
// Response: { data: Contract }

/**
 * POST /api/contracts
 * Create contract metric
 * Roles: admin, operator
 */
{
  "contract_name": "TokenStaking",
  "contract_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "status": "HEALTHY",
  "daily_invocations": 150,
  "avg_gas_cost": 0.045,
  "error_rate": 0.5,
  "total_value_locked": 125000
}
// Response: { data: Contract }

/**
 * PATCH /api/contracts/:id
 * Update contract
 * Roles: admin, operator
 */
{
  "status": "PAUSED",
  "error_rate": 5.2
}
// Response: { data: Contract }

/**
 * DELETE /api/contracts/:id
 * Delete contract
 * Roles: admin
 */
// Response: { message: "Contract deleted" }

// ============================================
// ORACLE FEED ENDPOINTS
// ============================================

/**
 * GET /api/oracles
 * List oracle feeds
 */
// Response: { data: OracleFeed[], total: number }

/**
 * GET /api/oracles/:id
 * Get oracle feed
 */
// Response: { data: OracleFeed }

/**
 * POST /api/oracles/:id/refresh
 * Force refresh oracle feed
 * Roles: admin, operator
 */
// Response: { data: OracleFeed, message: "Feed refreshed" }

/**
 * POST /api/oracles/:id/fallback
 * Trigger fallback oracle
 * Roles: admin
 */
// Response: { message: "Fallback activated" }

// ============================================
// TOKEN ANALYTICS ENDPOINTS
// ============================================

/**
 * GET /api/tokens/analytics
 * Get token analytics
 * Query: ?metric_type=TRANSFER&limit=100
 */
// Response: { data: TokenAnalytic[], total: number }

/**
 * POST /api/tokens/analytics
 * Record token activity
 */
{
  "metric_type": "STAKE",
  "amount": 10000,
  "from_address": "0x123...",
  "to_address": "0x456...",
  "timestamp": "2025-01-15T10:30:00Z",
  "tx_hash": "0xabc..."
}
// Response: { data: TokenAnalytic }

// ============================================
// MARKET ENDPOINTS
// ============================================

/**
 * GET /api/markets
 * List markets
 * Query: ?status=ACTIVE
 */
// Response: { data: Market[], total: number }

/**
 * POST /api/markets
 * Create market
 * Roles: admin, operator
 */
{
  "market_id": "MARKET-2025-001",
  "title": "Will ETH reach $5000 by Q2 2025?",
  "status": "ACTIVE",
  "created_at": "2025-01-15T00:00:00Z",
  "closes_at": "2025-06-30T23:59:59Z",
  "total_volume": 0,
  "participants": 0
}
// Response: { data: Market }

/**
 * PATCH /api/markets/:id/resolve
 * Resolve market
 * Roles: admin
 */
{
  "outcome": "YES",
  "resolved_at": "2025-06-30T23:59:59Z"
}
// Response: { data: Market }

// ============================================
// ALERT ENDPOINTS
// ============================================

/**
 * GET /api/alerts
 * List alerts
 * Query: ?is_resolved=false&severity=CRITICAL
 */
// Response: { data: Alert[], total: number }

/**
 * POST /api/alerts
 * Create alert
 */
{
  "alert_type": "CONTRACT_ERROR",
  "severity": "HIGH",
  "title": "Contract Error Rate Exceeded",
  "message": "TokenStaking error rate: 5.2% (threshold: 5%)",
  "threshold_value": 5,
  "current_value": 5.2
}
// Response: { data: Alert }

/**
 * PATCH /api/alerts/:id
 * Update alert (resolve, acknowledge)
 * Roles: admin, operator
 */
{
  "is_resolved": true,
  "resolved_at": "2025-01-15T12:00:00Z"
}
// Response: { data: Alert }

// ============================================
// COMPLIANCE ENDPOINTS
// ============================================

/**
 * GET /api/compliance/metrics
 * Get compliance metrics
 * Query: ?category=SECURITY&status=CERTIFIED
 */
// Response: { data: ComplianceMetric[], total: number }

/**
 * POST /api/compliance/metrics
 * Create compliance metric
 * Roles: admin, auditor
 */
{
  "standard_id": "ISO-27001",
  "standard_name": "ISO/IEC 27001:2022 Information Security",
  "category": "SECURITY",
  "compliance_score": 94,
  "status": "CERTIFIED",
  "certification_status": "CERTIFIED",
  "findings_count": 2
}
// Response: { data: ComplianceMetric }

/**
 * GET /api/compliance/evidence
 * List compliance evidence
 */
// Response: { data: ComplianceEvidence[], total: number }

// ============================================
// SECURITY INCIDENT ENDPOINTS
// ============================================

/**
 * GET /api/security/incidents
 * List security incidents
 * Query: ?status=INVESTIGATING&severity=CRITICAL
 */
// Response: { data: SecurityIncident[], total: number }

/**
 * POST /api/security/incidents
 * Report security incident
 * Roles: admin, operator
 */
{
  "incident_id": "SEC-2025-001",
  "incident_type": "UNAUTHORIZED_ACCESS",
  "severity": "HIGH",
  "status": "DETECTED",
  "affected_systems": "Admin Dashboard",
  "detection_method": "AUTOMATED_ALERT",
  "detected_at": "2025-01-15T10:00:00Z"
}
// Response: { data: SecurityIncident }

/**
 * PATCH /api/security/incidents/:id
 * Update incident status
 * Roles: admin, operator
 */
{
  "status": "CONTAINED",
  "root_cause": "Weak password policy",
  "remediation_actions": "Enforced 2FA for all admin users"
}
// Response: { data: SecurityIncident }

// ============================================
// AUDIT LOG ENDPOINTS
// ============================================

/**
 * GET /api/audit/logs
 * List audit logs
 * Query: ?status=SUCCESS&user_role=ADMIN&limit=100
 */
// Response: { data: AdminLog[], total: number }

/**
 * POST /api/audit/logs
 * Create audit log entry
 */
{
  "action": "Updated contract status",
  "endpoint": "/api/contracts/123",
  "status": "SUCCESS",
  "details": "Changed status from HEALTHY to PAUSED"
}
// Response: { data: AdminLog }

/**
 * GET /api/audit/export
 * Export audit logs to CSV
 * Query: ?from=2025-01-01&to=2025-01-31
 */
// Response: CSV file download

// ============================================
// AI AGENT ENDPOINTS
// ============================================

/**
 * GET /api/agents
 * List AI agents
 * Query: ?domain=ORACLE_INTEGRITY&is_active=true
 */
// Response: { data: Agent[], total: number }

/**
 * GET /api/agents/:name
 * Get agent details
 */
// Response: { data: Agent }

/**
 * POST /api/agents
 * Create agent
 * Roles: admin
 */
{
  "agent_name": "OracleValidator-v2",
  "agent_type": "AUTONOMOUS",
  "domain": "ORACLE_INTEGRITY",
  "trust_score": 75
}
// Response: { data: Agent }

/**
 * PATCH /api/agents/:name
 * Update agent
 * Roles: admin
 */
{
  "trust_score": 85,
  "is_active": true
}
// Response: { data: Agent }

/**
 * POST /api/agents/:name/retrain
 * Trigger agent retraining
 * Roles: admin
 */
// Response: { message: "Retraining initiated" }

// ============================================
// AGENT DECISION LOG ENDPOINTS
// ============================================

/**
 * GET /api/agents/decisions
 * List agent decisions
 * Query: ?agent_name=OracleValidator&human_response=APPROVED
 */
// Response: { data: AgentDecisionLog[], total: number }

/**
 * POST /api/agents/decisions
 * Log agent decision
 */
{
  "agent_name": "OracleValidator",
  "decision_type": "ASSISTED",
  "decision_description": "Trigger fallback oracle due to 90s latency",
  "confidence_score": 87,
  "data_sources_used": ["Oracle feed timestamps", "Historical latency data"],
  "iso_reference": "ISO 27017",
  "policy_used": "POLICY-012"
}
// Response: { data: AgentDecisionLog }

/**
 * PATCH /api/agents/decisions/:id
 * Update decision (human response)
 */
{
  "human_response": "APPROVED",
  "outcome": "SUCCESS"
}
// Response: { data: AgentDecisionLog }

// ============================================
// POLICY ENDPOINTS
// ============================================

/**
 * GET /api/policies
 * List policies
 */
// Response: { data: PolicyState[], total: number }

/**
 * POST /api/policies
 * Create policy
 * Roles: admin
 */
{
  "policy_id": "POLICY-020",
  "policy_name": "Auto-escalate unresolved markets",
  "version": "1.0.0",
  "policy_logic": {
    "trigger": "market.status === 'PENDING_RESOLUTION' && daysSinceExpiry > 2",
    "action": "escalate_to_compliance"
  },
  "iso_alignment": "ISO 38505-1"
}
// Response: { data: PolicyState }

/**
 * PATCH /api/policies/:id
 * Update policy
 * Roles: admin
 */
{
  "version": "1.1.0",
  "modification_reason": "Reduced escalation window from 48h to 24h"
}
// Response: { data: PolicyState }

// ============================================
// GOVERNANCE PROPOSAL ENDPOINTS
// ============================================

/**
 * GET /api/governance/proposals
 * List proposals
 * Query: ?status=VOTING
 */
// Response: { data: GovernanceProposal[], total: number }

/**
 * POST /api/governance/proposals
 * Create proposal
 */
{
  "proposal_id": "PROP-2025-001",
  "proposal_type": "POLICY_CHANGE",
  "title": "Reduce oracle fallback window",
  "description": "Change from 90s to 60s based on performance data",
  "proposed_by": "HUMAN",
  "proposer_identity": "admin@lumanagi.com",
  "justification": "98% of failures occur within 60s",
  "quorum_required": 3
}
// Response: { data: GovernanceProposal }

/**
 * POST /api/governance/proposals/:id/vote
 * Vote on proposal
 * Roles: admin, operator
 */
{
  "vote": "FOR" // FOR, AGAINST, ABSTAIN
}
// Response: { data: GovernanceProposal }

// ============================================
// RISK ASSESSMENT ENDPOINTS
// ============================================

/**
 * GET /api/risk/assessments
 * List risk assessments
 * Query: ?risk_category=SMART_CONTRACT&mitigation_status=IN_PROGRESS
 */
// Response: { data: RiskAssessment[], total: number }

/**
 * POST /api/risk/assessments
 * Create risk assessment
 * Roles: admin, auditor
 */
{
  "risk_id": "RISK-2025-001",
  "risk_category": "ORACLE_FAILURE",
  "risk_title": "Oracle feed manipulation",
  "risk_description": "Attacker could manipulate price feeds",
  "likelihood": "MEDIUM",
  "impact": "MAJOR",
  "risk_score": 15,
  "treatment_strategy": "MITIGATE"
}
// Response: { data: RiskAssessment }

// ============================================
// DATA QUALITY ENDPOINTS
// ============================================

/**
 * GET /api/data/quality
 * Get data quality metrics
 */
// Response: { data: DataQualityMetric[], total: number }

/**
 * POST /api/data/quality/assess
 * Run data quality assessment
 * Roles: admin, auditor
 */
{
  "data_source": "oracle_feeds",
  "quality_dimension": "TIMELINESS"
}
// Response: { data: DataQualityMetric }

// ============================================
// TREASURY ENDPOINTS
// ============================================

/**
 * GET /api/treasury/transactions
 * List treasury transactions
 * Query: ?budget_class=OPERATIONS
 */
// Response: { data: TreasuryTransaction[], total: number }

/**
 * POST /api/treasury/transactions
 * Record transaction
 * Roles: admin, operator
 */
{
  "transaction_type": "OUTFLOW",
  "amount": 5000,
  "token_symbol": "LMNG",
  "from_address": "0x123...",
  "to_address": "0x456...",
  "budget_class": "REWARDS",
  "tx_hash": "0xabc..."
}
// Response: { data: TreasuryTransaction }

// ============================================
// SIMULATION ENDPOINTS
// ============================================

/**
 * GET /api/simulations/scenarios
 * List simulation scenarios
 */
// Response: { data: SimulationScenario[], total: number }

/**
 * POST /api/simulations/scenarios
 * Create scenario
 * Roles: admin, operator
 */
{
  "scenario_name": "Oracle Failure Test",
  "scenario_type": "ORACLE_FAILURE",
  "target_systems": "ETH/USD Feed",
  "parameters": { "latency": 120, "error_rate": 15 }
}
// Response: { data: SimulationScenario }

/**
 * POST /api/simulations/scenarios/:id/execute
 * Execute simulation
 * Roles: admin, operator
 */
// Response: { data: SimulationScenario }

// ============================================
// SYSTEM STATUS ENDPOINTS
// ============================================

/**
 * GET /api/system/status
 * Get system health
 */
// Response: {
//   status: "HEALTHY",
//   components: {
//     database: "ONLINE",
//     rpc: "ONLINE",
//     oracles: "ACTIVE",
//     agents: "ACTIVE"
//   }
// }

/**
 * GET /api/system/trust-score
 * Get system trust score
 */
// Response: { data: SystemTrustScore }

// ============================================
// FEEDBACK ENDPOINTS
// ============================================

/**
 * POST /api/feedback/ai
 * Submit AI feedback
 */
{
  "decision_id": "DEC-2025-001",
  "ai_action_suggested": "Pause contract",
  "human_action_taken": "Paused and reviewed",
  "feedback_type": "MODIFIED",
  "helpfulness_score": 4,
  "reasoning": "Good suggestion but needed manual review first"
}
// Response: { data: AIFeedback }

// ============================================
// MIDDLEWARE & ERROR HANDLING
// ============================================

/**
 * All authenticated endpoints require JWT:
 * Headers: { Authorization: "Bearer <access_token>" }
 * 
 * Error responses follow this format:
 * {
 *   "error": {
 *     "code": "UNAUTHORIZED",
 *     "message": "Invalid or expired token",
 *     "details": {}
 *   }
 * }
 * 
 * HTTP Status Codes:
 * 200: Success
 * 201: Created
 * 400: Bad Request
 * 401: Unauthorized
 * 403: Forbidden (insufficient permissions)
 * 404: Not Found
 * 500: Internal Server Error
 */`;

  const handleDownload = () => {
    const blob = new Blob([apiSpec], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumanagi-api-spec.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">API Endpoints Export</h1>
          <p className="text-white/60">Complete RESTful API specification for backend implementation</p>
        </div>
        <Button onClick={handleDownload} className="bg-[#8B5CF6] hover:bg-[#7C3AED]">
          <Download className="w-4 h-4 mr-2" />
          Download API Spec
        </Button>
      </div>

      <div className="bg-[#0F111A] rounded-xl border border-white/10 p-6">
        <pre className="text-sm text-white/80 overflow-x-auto">
          <code>{apiSpec}</code>
        </pre>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-2">🔌 Total Endpoints</h3>
          <p className="text-4xl font-bold text-[#8B5CF6]">85+</p>
          <p className="text-sm text-white/60 mt-2">RESTful routes</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-2">🔐 Authentication</h3>
          <p className="text-4xl font-bold text-[#39ff14]">JWT</p>
          <p className="text-sm text-white/60 mt-2">Bearer token auth</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-2">📱 Mobile Ready</h3>
          <p className="text-4xl font-bold text-[#00d4ff]">100%</p>
          <p className="text-sm text-white/60 mt-2">Flutter compatible</p>
        </div>
      </div>
    </div>
  );
}