
import React from "react";
import GlassCard from "../components/GlassCard";
import PolicyRuleCard from "../components/PolicyRuleCard";
import MetricCard from "../components/MetricCard";
import { Workflow, Zap, Clock, CheckCircle2 } from "lucide-react";

export default function AutomationEngine() {
  const automations = [
    {
      policyName: "Auto-Resolve Stale Oracles",
      condition: "Oracle feed > 120s stale",
      action: "Trigger fallback + log incident",
      status: "active",
      lastTriggered: "1 hour ago",
      triggeredCount: 5,
      owner: "System"
    },
    {
      policyName: "Market Auto-Resolution",
      condition: "Market 24h past expiry",
      action: "Resolve market based on oracle data",
      status: "active",
      lastTriggered: "Yesterday",
      triggeredCount: 12,
      owner: "System"
    },
    {
      policyName: "Gas Price Optimization",
      condition: "Network congestion > 80%",
      action: "Delay non-critical transactions",
      status: "active",
      lastTriggered: "3 hours ago",
      triggeredCount: 23,
      owner: "System"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Automation Engine</h1>
        <p className="text-white/60">Self-healing infrastructure and autonomous workflows • ISO 27001 Controlled</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Active Automations"
          value={automations.length}
          icon={Workflow}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Total Triggers"
          value={automations.reduce((sum, a) => sum + a.triggeredCount, 0)}
          icon={Zap}
          trend="up"
          trendValue="+15% this week"
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Avg Response Time"
          value="1.2s"
          icon={Clock}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
        <MetricCard
          title="Success Rate"
          value="99.7%"
          icon={CheckCircle2}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Active Automation Rules</h3>
          <div className="grid gap-4">
            {automations.map((automation, idx) => (
              <PolicyRuleCard
                key={idx}
                policyName={automation.policyName}
                condition={automation.condition}
                action={automation.action}
                status={automation.status}
                lastTriggered={automation.lastTriggered}
                triggeredCount={automation.triggeredCount}
                owner={automation.owner}
              />
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
