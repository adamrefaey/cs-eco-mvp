import React from "react";
import { FileCheck, Shield, Zap, CheckCircle2, AlertTriangle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import PolicyRuleCard from "../components/PolicyRuleCard";
import { Badge } from "@/components/ui/badge";

export default function Policies() {
  const policies = [
    {
      id: "POLICY-003",
      name: "Auto-Pause on High Error Rate",
      trigger: "Contract error rate > 5%",
      action: "Pause contract automatically",
      enabled: true,
      executionCount: 12,
      lastTriggered: new Date(Date.now() - 3600000),
      iso: "ISO 27001 A.12.6"
    },
    {
      id: "POLICY-007",
      name: "Market Escalation Workflow",
      trigger: "Market unresolved 48h past expiry",
      action: "Escalate to compliance team",
      enabled: true,
      executionCount: 5,
      lastTriggered: new Date(Date.now() - 7200000),
      iso: "ISO 38505-1"
    },
    {
      id: "POLICY-012",
      name: "Oracle Fallback Trigger",
      trigger: "Oracle latency > 90s",
      action: "Activate fallback oracle",
      enabled: true,
      executionCount: 8,
      lastTriggered: new Date(Date.now() - 1800000),
      iso: "ISO 27017"
    },
    {
      id: "POLICY-019",
      name: "Treasury Spending Limits",
      trigger: "Transfer exceeds budget allocation",
      action: "Block transfer and notify admin",
      enabled: true,
      executionCount: 3,
      lastTriggered: new Date(Date.now() - 14400000),
      iso: "ISO 38505-1"
    }
  ];

  const stats = {
    total: policies.length,
    enabled: policies.filter(p => p.enabled).length,
    totalExecutions: policies.reduce((sum, p) => sum + p.executionCount, 0),
    avgExecutions: policies.reduce((sum, p) => sum + p.executionCount, 0) / policies.length
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Policy Engine</h1>
        <p className="text-white/60">Automated rule execution with versioning and ISO traceability • ISO 38505-1, ISO 42001</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Policies"
          value={stats.total}
          icon={FileCheck}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Enabled"
          value={`${stats.enabled}/${stats.total}`}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Total Executions"
          value={stats.totalExecutions}
          icon={Zap}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Avg Executions"
          value={stats.avgExecutions.toFixed(1)}
          icon={Shield}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <div className="space-y-4">
        {policies.map((policy) => (
          <PolicyRuleCard
            key={policy.id}
            policy={policy}
            onToggle={() => alert(`Policy ${policy.id} toggled`)}
            onEdit={() => alert(`Edit policy ${policy.id}`)}
          />
        ))}
      </div>
    </div>
  );
}