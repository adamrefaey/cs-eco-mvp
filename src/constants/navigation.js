import {
  LayoutDashboard,
  FileCode2,
  Coins,
  TrendingUp,
  Radio,
  FileText,
  Bell,
  Shield,
  Activity,
  Lock,
  Eye,
  Brain,
  Database,
  Workflow,
  Settings,
  FileCheck,
  Target,
  Lightbulb,
  GitBranch,
  Users,
  Calendar,
  Key,
  Server,
  Sliders,
  Clock,
  Zap
} from "lucide-react";
import { createPageUrl } from "@/utils";

/**
 * Navigation Categories Configuration
 *
 * Defines the sidebar navigation structure with:
 * - Categories (groups)
 * - Navigation items
 * - Icons, ISO standards, access control
 */
export const navigationCategories = [
  {
    label: "MISSION CONTROL",
    id: "mission-control",
    items: [
      {
        title: "Dashboard",
        url: createPageUrl("Dashboard"),
        icon: LayoutDashboard,
        iso: "ISO 25010",
        description: "Overview of metrics and system health"
      },
      {
        title: "Neural Insights",
        url: createPageUrl("NeuralIntelligence"),
        icon: Brain,
        iso: "ISO 42001",
        description: "AI-suggested actions",
        aiPowered: true
      },
      {
        title: "Explainability Center",
        url: createPageUrl("ExplainabilityCenter"),
        icon: Lightbulb,
        iso: "ISO 22989",
        description: "Transparent AI reasoning"
      },
      {
        title: "Policy Engine",
        url: createPageUrl("Policies"),
        icon: FileCheck,
        iso: "ISO 38505-1",
        description: "Governance rules and policies"
      }
    ]
  },
  {
    label: "OPERATIONS",
    id: "operations",
    items: [
      {
        title: "Smart Contracts",
        url: createPageUrl("Contracts"),
        icon: FileCode2,
        iso: "ISO 27034",
        description: "Contract health monitoring",
        roles: ['admin', 'operator']
      },
      {
        title: "Oracle Feeds",
        url: createPageUrl("Oracles"),
        icon: Radio,
        iso: "ISO 27001",
        description: "Data feed integrity",
        liveStatus: "active"
      },
      {
        title: "Markets",
        url: createPageUrl("Markets"),
        icon: TrendingUp,
        iso: "ISO 25010",
        description: "Prediction markets"
      },
      {
        title: "Schedulers",
        url: createPageUrl("Schedulers"),
        icon: Calendar,
        iso: "ISO 20000-1",
        description: "Automated jobs",
        roles: ['admin', 'operator']
      },
      {
        title: "Treasury Ops",
        url: createPageUrl("TreasuryOps"),
        icon: Coins,
        iso: "ISO 38505-1",
        description: "Token flow management",
        roles: ['admin', 'operator']
      }
    ]
  },
  {
    label: "ANALYTICS",
    id: "analytics",
    items: [
      {
        title: "Token Analytics",
        url: createPageUrl("TokenAnalytics"),
        icon: Coins,
        iso: "ISO 25012",
        description: "LMNG token metrics"
      },
      {
        title: "Deviation Monitor",
        url: createPageUrl("DeviationMonitor"),
        icon: Activity,
        iso: "ISO 27005",
        description: "Anomaly detection"
      },
      {
        title: "AI Actions Log",
        url: createPageUrl("AIActionsLog"),
        icon: GitBranch,
        iso: "ISO 42001",
        description: "Agent decision history",
        aiPowered: true
      },
      {
        title: "Prediction Risk Map",
        url: createPageUrl("PredictionRiskMap"),
        icon: Target,
        iso: "ISO 31000",
        description: "Risk assessment"
      }
    ]
  },
  {
    label: "SECURITY & COMPLIANCE",
    id: "security",
    items: [
      {
        title: "Compliance",
        url: createPageUrl("Compliance"),
        icon: Shield,
        iso: "ISO 27001",
        description: "ISO certification status",
        liveStatus: "protected"
      },
      {
        title: "Security Posture",
        url: createPageUrl("SecurityPosture"),
        icon: Eye,
        iso: "ISO 27002",
        description: "Security controls"
      },
      {
        title: "Alerts",
        url: createPageUrl("Alerts"),
        icon: Bell,
        iso: "ISO 27035",
        description: "Active system alerts",
        badge: 3
      },
      {
        title: "Audit Logs",
        url: createPageUrl("AuditLogs"),
        icon: FileText,
        iso: "ISO 27001",
        description: "Full action trail"
      },
      {
        title: "Access Control",
        url: createPageUrl("AccessControl"),
        icon: Key,
        iso: "ISO 27001 A.9",
        description: "RBAC management",
        roles: ['admin']
      },
      {
        title: "Data Vault",
        url: createPageUrl("DataVault"),
        icon: Lock,
        iso: "ISO 27701",
        description: "Encrypted storage"
      },
      {
        title: "Trust Boundaries",
        url: createPageUrl("TrustBoundaries"),
        icon: Shield,
        iso: "NIST 800-207",
        description: "Zero-trust controls"
      }
    ]
  },
  {
    label: "GOVERNANCE",
    id: "governance",
    items: [
      {
        title: "Risk Management",
        url: createPageUrl("RiskManagement"),
        icon: Target,
        iso: "ISO 31000",
        description: "Risk assessment"
      },
      {
        title: "Data Governance",
        url: createPageUrl("DataGovernance"),
        icon: Database,
        iso: "ISO 38505",
        description: "Data quality controls"
      },
      {
        title: "AI Governance",
        url: createPageUrl("AIGovernance"),
        icon: Brain,
        iso: "ISO 42001",
        description: "AI system oversight",
        aiPowered: true
      },
      {
        title: "Identity Graph",
        url: createPageUrl("IdentityGraph"),
        icon: Users,
        iso: "ISO 24760",
        description: "Entity relationships"
      },
      {
        title: "Certify",
        url: createPageUrl("Certify"),
        icon: FileCheck,
        iso: "SOC 2 Type II",
        description: "Certification manager"
      }
    ]
  },
  {
    label: "INTELLIGENT SYSTEMS",
    id: "intelligent",
    items: [
      {
        title: "Temporal Reasoning",
        url: createPageUrl("TemporalReasoning"),
        icon: Clock,
        iso: "ISO 25023",
        description: "Time-series intelligence"
      },
      {
        title: "Scenario Simulator",
        url: createPageUrl("ScenarioSimulator"),
        icon: Zap,
        iso: "ISO 22301",
        description: "What-if testing"
      },
      {
        title: "Feedback Loop",
        url: createPageUrl("FeedbackLoop"),
        icon: Brain,
        iso: "ISO 42001",
        description: "AI learning system",
        aiPowered: true
      },
      {
        title: "Automation Engine",
        url: createPageUrl("AutomationEngine"),
        icon: Workflow,
        iso: "ISO 27001",
        description: "Policy automation"
      }
    ]
  },
  {
    label: "SYSTEM",
    id: "system",
    items: [
      {
        title: "System Status",
        url: createPageUrl("SystemStatus"),
        icon: Server,
        iso: "ISO 27001",
        description: "Infrastructure health",
        liveStatus: "online"
      },
      {
        title: "Agent Controls",
        url: createPageUrl("AgentControls"),
        icon: Sliders,
        iso: "ISO 22989",
        description: "AI agent configuration",
        roles: ['admin']
      }
    ]
  }
];
