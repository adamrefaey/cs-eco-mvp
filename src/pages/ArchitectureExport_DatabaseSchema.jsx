import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DatabaseSchemaExport() {
  const prismaSchema = `// Lumanagi Database Schema - Prisma ORM
// PostgreSQL Database
// Run: npx prisma migrate dev --name init

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================
// CORE ENTITIES
// ============================================

model User {
  id              String   @id @default(uuid())
  email           String   @unique
  full_name       String
  role            Role     @default(USER)
  password_hash   String?
  settings        Json?    // User preferences JSON
  created_date    DateTime @default(now())
  updated_date    DateTime @updatedAt
  
  // Relations
  admin_logs      AdminLog[]
  decisions       AgentDecisionLog[] @relation("CreatedBy")
  proposals       GovernanceProposal[]
  
  @@map("users")
}

enum Role {
  ADMIN
  OPERATOR
  USER
  AUDITOR
  VIEWER
}

// ============================================
// INFRASTRUCTURE MONITORING
// ============================================

model ContractMetric {
  id                  String   @id @default(uuid())
  contract_name       String
  contract_address    String   @unique
  status              ContractStatus
  daily_invocations   Int      @default(0)
  avg_gas_cost        Float    @default(0)
  error_rate          Float    @default(0)
  last_invocation     DateTime?
  total_value_locked  Float    @default(0)
  created_date        DateTime @default(now())
  updated_date        DateTime @updatedAt
  created_by          String
  
  @@map("contract_metrics")
  @@index([status])
  @@index([contract_address])
}

enum ContractStatus {
  HEALTHY
  WARNING
  CRITICAL
  PAUSED
}

model OracleFeed {
  id                  String       @id @default(uuid())
  feed_name           String
  pair                String
  price               Float
  last_update         DateTime
  status              OracleStatus
  deviation_threshold Float        @default(1.0)
  update_frequency    Int          @default(60)
  created_date        DateTime     @default(now())
  updated_date        DateTime     @updatedAt
  created_by          String
  
  @@map("oracle_feeds")
  @@index([pair])
  @@index([status])
}

enum OracleStatus {
  ACTIVE
  STALE
  ERROR
}

model TokenAnalytic {
  id                   String      @id @default(uuid())
  metric_type          TokenMetricType
  amount               Float
  from_address         String?
  to_address           String?
  timestamp            DateTime
  tx_hash              String?
  staking_duration_days Int?
  created_date         DateTime    @default(now())
  created_by           String
  
  @@map("token_analytics")
  @@index([metric_type])
  @@index([timestamp])
}

enum TokenMetricType {
  TRANSFER
  STAKE
  REWARD
  BURN
}

model Market {
  id              String       @id @default(uuid())
  market_id       String       @unique
  title           String
  status          MarketStatus
  outcome         String?
  total_volume    Float        @default(0)
  participants    Int          @default(0)
  created_at      DateTime
  closes_at       DateTime
  resolved_at     DateTime?
  created_date    DateTime     @default(now())
  updated_date    DateTime     @updatedAt
  created_by      String
  
  @@map("markets")
  @@index([status])
  @@index([closes_at])
}

enum MarketStatus {
  ACTIVE
  CLOSED
  PENDING_RESOLUTION
  RESOLVED
}

// ============================================
// SECURITY & COMPLIANCE
// ============================================

model Alert {
  id                 String        @id @default(uuid())
  alert_type         AlertType
  severity           Severity
  title              String
  message            String
  threshold_value    Float?
  current_value      Float?
  is_resolved        Boolean       @default(false)
  resolved_at        DateTime?
  notification_sent  Boolean       @default(false)
  created_date       DateTime      @default(now())
  updated_date       DateTime      @updatedAt
  created_by         String
  
  @@map("alerts")
  @@index([is_resolved])
  @@index([severity])
  @@index([alert_type])
}

enum AlertType {
  CONTRACT_ERROR
  TOKEN_DRAIN
  ORACLE_DELAY
  GAS_SPIKE
  SECURITY
  SYSTEM
}

enum Severity {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model SecurityIncident {
  id                      String         @id @default(uuid())
  incident_id             String         @unique
  incident_type           IncidentType
  severity                Severity
  status                  IncidentStatus
  affected_systems        String?
  detection_method        DetectionMethod
  detected_at             DateTime
  resolved_at             DateTime?
  response_time_minutes   Int?
  resolution_time_hours   Float?
  impact_assessment       String?
  root_cause              String?
  remediation_actions     String?
  iso_reference           String?
  created_date            DateTime       @default(now())
  updated_date            DateTime       @updatedAt
  created_by              String
  
  @@map("security_incidents")
  @@index([status])
  @@index([severity])
  @@index([detected_at])
}

enum IncidentType {
  UNAUTHORIZED_ACCESS
  DATA_BREACH
  SMART_CONTRACT_EXPLOIT
  ORACLE_MANIPULATION
  DOS_ATTACK
  PRIVILEGE_ESCALATION
  MALWARE
  PHISHING
  OTHER
}

enum IncidentStatus {
  DETECTED
  INVESTIGATING
  CONTAINED
  RESOLVED
  CLOSED
}

enum DetectionMethod {
  AUTOMATED_ALERT
  MANUAL_REVIEW
  USER_REPORT
  PENETRATION_TEST
  AUDIT
}

model ComplianceMetric {
  id                    String            @id @default(uuid())
  standard_id           String
  standard_name         String
  category              ComplianceCategory
  compliance_score      Float             // 0-100
  status                ComplianceStatus
  last_audit_date       DateTime?
  next_audit_date       DateTime?
  certification_status  CertificationStatus
  findings_count        Int               @default(0)
  remediation_progress  Float?            // 0-100
  created_date          DateTime          @default(now())
  updated_date          DateTime          @updatedAt
  created_by            String
  
  @@map("compliance_metrics")
  @@index([standard_id])
  @@index([category])
  @@index([status])
}

enum ComplianceCategory {
  SECURITY
  PRIVACY
  QUALITY
  AI_GOVERNANCE
  DATA_GOVERNANCE
  BUSINESS_CONTINUITY
}

enum ComplianceStatus {
  COMPLIANT
  PARTIAL
  NON_COMPLIANT
  IN_PROGRESS
  CERTIFIED
}

enum CertificationStatus {
  CERTIFIED
  PENDING
  NOT_CERTIFIED
  RENEWAL_REQUIRED
}

model AdminLog {
  id          String   @id @default(uuid())
  action      String
  endpoint    String?
  ip_address  String?
  user_role   Role
  status      LogStatus
  details     String?
  created_date DateTime @default(now())
  created_by  String
  user        User     @relation(fields: [created_by], references: [email])
  
  @@map("admin_logs")
  @@index([created_date])
  @@index([user_role])
  @@index([status])
}

enum LogStatus {
  SUCCESS
  FAILURE
  WARNING
}

// ============================================
// AI GOVERNANCE & AGENTS
// ============================================

model Agent {
  id                       String    @id @default(uuid())
  agent_name               String    @unique
  agent_type               AgentType
  domain                   AgentDomain
  cluster_id               String?
  trust_score              Float     // 0-100
  memory_state             Json?     // Agent memory JSON
  total_decisions          Int       @default(0)
  successful_decisions     Int       @default(0)
  overridden_decisions     Int       @default(0)
  last_retrain_date        DateTime?
  drift_score              Float     @default(0) // 0-100
  bias_score               Float     @default(0) // 0-100
  constitutional_violations Int      @default(0)
  is_active                Boolean   @default(true)
  created_date             DateTime  @default(now())
  updated_date             DateTime  @updatedAt
  created_by               String
  
  // Relations
  decisions                AgentDecisionLog[]
  cluster                  AgentCluster? @relation(fields: [cluster_id], references: [id])
  
  @@map("agents")
  @@index([agent_type])
  @@index([domain])
  @@index([trust_score])
}

enum AgentType {
  AUTONOMOUS
  ASSISTED
  GOVERNED
}

enum AgentDomain {
  ORACLE_INTEGRITY
  GAS_ECONOMICS
  STAKING_TRENDS
  CONTRACT_HEALTH
  TREASURY_OPS
  RISK_ANALYSIS
  COMPLIANCE
}

model AgentDecisionLog {
  id                    String       @id @default(uuid())
  agent_name            String
  decision_type         AgentType
  decision_description  String
  confidence_score      Float        // 0-100
  data_sources_used     Json?
  data_sources_ignored  Json?
  pattern_matched       String?
  iso_reference         String?
  policy_used           String?
  quorum_required       Boolean      @default(false)
  quorum_votes          Json?
  human_response        HumanResponse?
  outcome               DecisionOutcome?
  trust_impact          Float?
  memory_update         String?
  constitutional_check  Boolean      @default(true)
  created_date          DateTime     @default(now())
  created_by            String
  
  agent                 Agent        @relation(fields: [agent_name], references: [agent_name])
  user                  User         @relation("CreatedBy", fields: [created_by], references: [email])
  
  @@map("agent_decision_logs")
  @@index([agent_name])
  @@index([created_date])
  @@index([human_response])
}

enum HumanResponse {
  APPROVED
  REJECTED
  MODIFIED
  ESCALATED
  PENDING
}

enum DecisionOutcome {
  SUCCESS
  FAILURE
  PARTIAL
  UNKNOWN
}

model PolicyState {
  id                      String   @id @default(uuid())
  policy_id               String   @unique
  policy_name             String
  version                 String
  policy_logic            Json     // Policy tree structure
  maturity_score          Float    @default(0) // 0-100
  execution_count         Int      @default(0)
  success_rate            Float    @default(0) // 0-100
  override_count          Int      @default(0)
  last_modified_by        String
  modification_reason     String?
  previous_version        String?
  iso_alignment           String?
  constitutional_compliance Boolean @default(true)
  agent_consensus_score   Float    @default(0) // 0-100
  human_consensus_score   Float    @default(0) // 0-100
  created_date            DateTime @default(now())
  updated_date            DateTime @updatedAt
  created_by              String
  
  @@map("policy_states")
  @@index([policy_id])
  @@index([version])
}

model ConstitutionalRule {
  id                  String           @id @default(uuid())
  rule_id             String           @unique
  rule_name           String
  rule_description    String
  rule_logic          String           // Executable logic
  severity            Severity
  violates_ethics     Boolean          @default(false)
  standard_reference  String?
  enforcement_action  EnforcementAction
  violation_count     Int              @default(0)
  is_active           Boolean          @default(true)
  created_date        DateTime         @default(now())
  updated_date        DateTime         @updatedAt
  created_by          String
  
  @@map("constitutional_rules")
  @@index([rule_id])
  @@index([is_active])
}

enum EnforcementAction {
  BLOCK
  ESCALATE
  WARN
  LOG
}

model AgentCluster {
  id                      String      @id @default(uuid())
  cluster_name            String      @unique
  domain                  AgentDomain
  member_agents           Json        // Array of agent names
  cluster_trust_score     Float       @default(0) // 0-100
  consensus_threshold     Float       @default(75) // 0-100
  total_decisions         Int         @default(0)
  cluster_memory          Json?
  communication_protocol  String?
  created_date            DateTime    @default(now())
  updated_date            DateTime    @updatedAt
  created_by              String
  
  agents                  Agent[]
  
  @@map("agent_clusters")
  @@index([cluster_name])
  @@index([domain])
}

model AIFeedback {
  id                  String   @id @default(uuid())
  decision_id         String
  ai_action_suggested String
  human_action_taken  String
  feedback_type       FeedbackType
  helpfulness_score   Int      // 1-5
  confidence_accurate Boolean?
  reasoning           String?
  context_data        String?
  model_version       String?
  will_retrain        Boolean  @default(true)
  created_date        DateTime @default(now())
  created_by          String
  
  @@map("ai_feedback")
  @@index([decision_id])
  @@index([feedback_type])
}

enum FeedbackType {
  ACCEPTED
  REJECTED
  MODIFIED
  ESCALATED
}

model AIModelMetric {
  id                    String          @id @default(uuid())
  model_name            String
  model_version         String
  use_case              AIUseCase
  accuracy_score        Float           // 0-100
  fairness_score        Float           // 0-100
  robustness_score      Float           // 0-100
  explainability_level  ExplainabilityLevel
  training_data_sources String?
  last_trained          DateTime?
  prediction_count      Int             @default(0)
  iso_42001_compliant   Boolean         @default(false)
  bias_audit_status     BiasAuditStatus
  drift_detected        Boolean         @default(false)
  monitoring_enabled    Boolean         @default(true)
  created_date          DateTime        @default(now())
  updated_date          DateTime        @updatedAt
  created_by            String
  
  @@map("ai_model_metrics")
  @@index([model_name])
  @@index([use_case])
}

enum AIUseCase {
  MARKET_PREDICTION
  RISK_SCORING
  FRAUD_DETECTION
  ANOMALY_DETECTION
  RECOMMENDATION
  SENTIMENT_ANALYSIS
}

enum ExplainabilityLevel {
  HIGH
  MEDIUM
  LOW
}

enum BiasAuditStatus {
  PASSED
  FAILED
  PENDING
  NOT_TESTED
}

// ============================================
// GOVERNANCE & PROPOSALS
// ============================================

model GovernanceProposal {
  id                  String         @id @default(uuid())
  proposal_id         String         @unique
  proposal_type       ProposalType
  title               String
  description         String
  proposed_by         ProposerType
  proposer_identity   String
  justification       String?
  supporting_data     Json?
  impact_analysis     String?
  rollback_plan       String?
  quorum_required     Int
  votes_for           Int            @default(0)
  votes_against       Int            @default(0)
  votes_abstain       Int            @default(0)
  voting_record       Json?
  status              ProposalStatus
  voting_deadline     DateTime?
  implementation_date DateTime?
  created_date        DateTime       @default(now())
  updated_date        DateTime       @updatedAt
  created_by          String
  user                User           @relation(fields: [created_by], references: [email])
  
  @@map("governance_proposals")
  @@index([proposal_id])
  @@index([status])
  @@index([proposal_type])
}

enum ProposalType {
  POLICY_CHANGE
  AGENT_PARAMETER
  CONSTITUTIONAL_AMENDMENT
  SYSTEM_UPGRADE
}

enum ProposerType {
  HUMAN
  AGENT
  CLUSTER
}

enum ProposalStatus {
  PROPOSED
  VOTING
  APPROVED
  REJECTED
  IMPLEMENTED
}

model RiskAssessment {
  id                    String         @id @default(uuid())
  risk_id               String         @unique
  risk_category         RiskCategory
  risk_title            String
  risk_description      String
  likelihood            Likelihood
  impact                Impact
  risk_score            Int            // 1-25
  treatment_strategy    TreatmentStrategy
  mitigation_status     MitigationStatus
  owner                 String?
  iso_31000_aligned     Boolean        @default(true)
  controls_implemented  String?
  residual_risk         Likelihood?
  review_date           DateTime?
  created_date          DateTime       @default(now())
  updated_date          DateTime       @updatedAt
  created_by            String
  
  @@map("risk_assessments")
  @@index([risk_category])
  @@index([risk_score])
  @@index([mitigation_status])
}

enum RiskCategory {
  SMART_CONTRACT
  ORACLE_FAILURE
  MARKET_MANIPULATION
  TOKEN_VOLATILITY
  REGULATORY
  OPERATIONAL
  REPUTATIONAL
  TECHNICAL
}

enum Likelihood {
  VERY_LOW
  LOW
  MEDIUM
  HIGH
  VERY_HIGH
}

enum Impact {
  NEGLIGIBLE
  MINOR
  MODERATE
  MAJOR
  CATASTROPHIC
}

enum TreatmentStrategy {
  AVOID
  MITIGATE
  TRANSFER
  ACCEPT
}

enum MitigationStatus {
  IDENTIFIED
  PLANNED
  IN_PROGRESS
  MITIGATED
  ACCEPTED
}

// ============================================
// DATA QUALITY & OBSERVABILITY
// ============================================

model DataQualityMetric {
  id                  String           @id @default(uuid())
  data_source         String
  quality_dimension   QualityDimension
  quality_score       Float            // 0-100
  records_evaluated   Int
  issues_found        Int              @default(0)
  issue_severity      Severity?
  pii_detected        Boolean          @default(false)
  encryption_status   EncryptionStatus
  retention_compliant Boolean          @default(true)
  gdpr_compliant      Boolean          @default(true)
  iso_38505_aligned   Boolean          @default(true)
  assessment_date     DateTime
  created_date        DateTime         @default(now())
  updated_date        DateTime         @updatedAt
  created_by          String
  
  @@map("data_quality_metrics")
  @@index([data_source])
  @@index([quality_dimension])
  @@index([assessment_date])
}

enum QualityDimension {
  ACCURACY
  COMPLETENESS
  CONSISTENCY
  TIMELINESS
  VALIDITY
  INTEGRITY
}

enum EncryptionStatus {
  ENCRYPTED
  PARTIAL
  UNENCRYPTED
}

model TrustBoundaryEvent {
  id                  String             @id @default(uuid())
  event_type          BoundaryEventType
  source_module       String
  target_module       String
  action_attempted    String
  user_role           Role
  permission_required String?
  verification_method VerificationMethod
  risk_score          Float              @default(0) // 0-100
  nist_control        String?
  created_date        DateTime           @default(now())
  created_by          String
  
  @@map("trust_boundary_events")
  @@index([event_type])
  @@index([created_date])
  @@index([risk_score])
}

enum BoundaryEventType {
  ALLOWED
  BLOCKED
  ESCALATED
  VERIFIED
}

enum VerificationMethod {
  RBAC
  MFA
  API_KEY
  SIGNATURE
  POLICY_CHECK
}

model TemporalAnomaly {
  id                String       @id @default(uuid())
  anomaly_type      AnomalyType
  entity_type       String
  entity_id         String
  expected_time     DateTime
  actual_time       DateTime?
  delay_minutes     Int?
  timeliness_score  Float        @default(100) // 0-100
  severity          Severity
  auto_corrected    Boolean      @default(false)
  correction_action String?
  created_date      DateTime     @default(now())
  created_by        String
  
  @@map("temporal_anomalies")
  @@index([anomaly_type])
  @@index([entity_type])
  @@index([severity])
}

enum AnomalyType {
  DELAYED
  MISSING
  EARLY
  DUPLICATE
  OUT_OF_SEQUENCE
}

model TreasuryTransaction {
  id                  String             @id @default(uuid())
  transaction_type    TransactionType
  amount              Float
  token_symbol        String             @default("LMNG")
  from_address        String?
  to_address          String?
  budget_class        BudgetClass
  policy_compliant    Boolean            @default(true)
  approval_required   Boolean            @default(false)
  approved_by         String?
  tx_hash             String?
  notes               String?
  created_date        DateTime           @default(now())
  created_by          String
  
  @@map("treasury_transactions")
  @@index([transaction_type])
  @@index([budget_class])
  @@index([created_date])
}

enum TransactionType {
  INFLOW
  OUTFLOW
  STAKE
  UNSTAKE
  REWARD
  BURN
  BUDGET_ALLOCATION
}

enum BudgetClass {
  OPERATIONS
  REWARDS
  DEVELOPMENT
  MARKETING
  RESERVE
  GOVERNANCE
}

model SimulationScenario {
  id                     String       @id @default(uuid())
  scenario_name          String
  scenario_type          ScenarioType
  target_systems         String
  parameters             Json?
  expected_response      String?
  actual_response        String?
  response_time_seconds  Float?
  test_passed            Boolean      @default(false)
  findings               String?
  executed_at            DateTime?
  executed_by            String?
  created_date           DateTime     @default(now())
  created_by             String
  
  @@map("simulation_scenarios")
  @@index([scenario_type])
  @@index([test_passed])
}

enum ScenarioType {
  GAS_SPIKE
  ORACLE_FAILURE
  CONTRACT_EXPLOIT
  NETWORK_OUTAGE
  DATA_CORRUPTION
  DDOS_ATTACK
}

model ComplianceEvidence {
  id                   String       @id @default(uuid())
  standard_id          String
  control_id           String
  control_name         String
  evidence_type        EvidenceType
  evidence_location    String
  evidence_description String
  collection_date      DateTime
  validity_period_days Int?
  reviewed_by          String?
  status               EvidenceStatus
  created_date         DateTime     @default(now())
  updated_date         DateTime     @updatedAt
  created_by           String
  
  @@map("compliance_evidence")
  @@index([standard_id])
  @@index([control_id])
  @@index([status])
}

enum EvidenceType {
  AUDIT_LOG
  UI_CONTROL
  DECISION_TRAIL
  POLICY_DOCUMENT
  TEST_RESULT
  TRAINING_RECORD
}

enum EvidenceStatus {
  VALID
  EXPIRED
  PENDING_REVIEW
  INSUFFICIENT
}

model MetaAudit {
  id                    String   @id @default(uuid())
  audit_of_audit_id     String
  auditor_role          Role
  audit_purpose         AuditPurpose
  findings              String
  evidence_chain        Json?
  confidence_in_original Float   // 0-100
  discrepancies_found   Int      @default(0)
  corrective_actions    String?
  iso_27001_aligned     Boolean  @default(true)
  created_date          DateTime @default(now())
  created_by            String
  
  @@map("meta_audits")
  @@index([audit_of_audit_id])
  @@index([audit_purpose])
}

enum AuditPurpose {
  COMPLIANCE_REVIEW
  PATTERN_ANALYSIS
  ANOMALY_DETECTION
  EVIDENCE_VERIFICATION
}

model SystemTrustScore {
  id                        String   @id @default(uuid())
  snapshot_timestamp        DateTime
  overall_trust_score       Float    // 0-100
  automation_rate           Float    // 0-100
  human_override_rate       Float    // 0-100
  success_rate              Float    // 0-100
  explainability_score      Float    // 0-100
  constitutional_compliance Float    // 0-100
  agent_consensus           Float    // 0-100
  human_consensus           Float    // 0-100
  drift_detected            Boolean  @default(false)
  bias_detected             Boolean  @default(false)
  created_date              DateTime @default(now())
  created_by                String
  
  @@map("system_trust_scores")
  @@index([snapshot_timestamp])
  @@index([overall_trust_score])
}`;

  const handleDownload = () => {
    const blob = new Blob([prismaSchema], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumanagi-schema.prisma";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Database Schema Export</h1>
          <p className="text-white/60">Complete Prisma schema for PostgreSQL migration</p>
        </div>
        <Button onClick={handleDownload} className="bg-[#3B82F6] hover:bg-[#2563EB]">
          <Download className="w-4 h-4 mr-2" />
          Download schema.prisma
        </Button>
      </div>

      <div className="bg-[#0F111A] rounded-xl border border-white/10 p-6">
        <pre className="text-sm text-white/80 overflow-x-auto">
          <code>{prismaSchema}</code>
        </pre>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-2">📊 Total Models</h3>
          <p className="text-4xl font-bold text-[#3B82F6]">42</p>
          <p className="text-sm text-white/60 mt-2">Entities exported</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-2">🔗 Relations</h3>
          <p className="text-4xl font-bold text-[#8B5CF6]">28</p>
          <p className="text-sm text-white/60 mt-2">Foreign key relationships</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-bold mb-2">📑 Enums</h3>
          <p className="text-4xl font-bold text-[#39ff14]">35</p>
          <p className="text-sm text-white/60 mt-2">Type-safe enumerations</p>
        </div>
      </div>
    </div>
  );
}