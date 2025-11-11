import { client } from './client';

// Entity exports using the new client structure
export const ContractMetric = client.entities.ContractMetric;
export const TokenAnalytic = client.entities.TokenAnalytic;
export const Market = client.entities.Market;
export const OracleFeed = client.entities.OracleFeed;
export const AdminLog = client.entities.AdminLog;
export const Alert = client.entities.Alert;
export const ComplianceMetric = client.entities.ComplianceMetric;
export const SecurityIncident = client.entities.SecurityIncident;
export const RiskAssessment = client.entities.RiskAssessment;
export const AIModelMetric = client.entities.AIModelMetric;
export const DataQualityMetric = client.entities.DataQualityMetric;
export const TrustBoundaryEvent = client.entities.TrustBoundaryEvent;
export const TemporalAnomaly = client.entities.TemporalAnomaly;
export const TreasuryTransaction = client.entities.TreasuryTransaction;
export const SimulationScenario = client.entities.SimulationScenario;
export const AIFeedback = client.entities.AIFeedback;
export const ComplianceEvidence = client.entities.ComplianceEvidence;
export const Agent = client.entities.Agent;
export const PolicyState = client.entities.PolicyState;
export const AgentDecisionLog = client.entities.AgentDecisionLog;
export const ConstitutionalRule = client.entities.ConstitutionalRule;
export const AgentCluster = client.entities.AgentCluster;
export const MetaAudit = client.entities.MetaAudit;
export const GovernanceProposal = client.entities.GovernanceProposal;
export const SystemTrustScore = client.entities.SystemTrustScore;

// Auth service - using new JWT-based authentication
export const User = client.auth;