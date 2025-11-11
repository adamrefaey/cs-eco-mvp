import React, { useState } from "react";
import { Lightbulb, Brain, CheckCircle2, AlertTriangle, Eye, FileText } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function ExplainabilityCenter() {
  const [filter, setFilter] = useState("all");

  const decisions = [
    {
      id: "dec-001",
      timestamp: new Date(Date.now() - 3600000),
      action: "Auto-paused Contract: TokenStaking",
      reasoning: "Error rate exceeded 5% threshold (actual: 6.2%) for 10+ minutes",
      dataUsed: ["Contract metrics", "Error logs", "Gas cost trends"],
      confidence: 0.94,
      outcome: "success",
      humanOverride: false,
      policyReference: "POLICY-003: Auto-pause on high error rate"
    },
    {
      id: "dec-002",
      timestamp: new Date(Date.now() - 7200000),
      action: "Escalated Market: ETH Price Q1",
      reasoning: "Market remained unresolved 48h past expiry deadline",
      dataUsed: ["Market status", "Expiry timestamp", "Compliance rules"],
      confidence: 0.98,
      outcome: "success",
      humanOverride: false,
      policyReference: "POLICY-007: Market escalation workflow"
    },
    {
      id: "dec-003",
      timestamp: new Date(Date.now() - 10800000),
      action: "Triggered Fallback Oracle: ETH/USD",
      reasoning: "Primary oracle latency > 90s, no update in 120s",
      dataUsed: ["Oracle latency metrics", "Last update timestamp", "Fallback status"],
      confidence: 0.91,
      outcome: "success",
      humanOverride: false,
      policyReference: "POLICY-012: Oracle fallback trigger"
    },
    {
      id: "dec-004",
      timestamp: new Date(Date.now() - 14400000),
      action: "Suggested Gas Optimization: RewardDistributor",
      reasoning: "Loop structure detected consuming 23% more gas than optimal pattern",
      dataUsed: ["Contract bytecode", "Gas usage history", "Similar contract patterns"],
      confidence: 0.85,
      outcome: "pending",
      humanOverride: false,
      policyReference: null
    },
    {
      id: "dec-005",
      timestamp: new Date(Date.now() - 18000000),
      action: "Blocked Treasury Transfer: 50K LMNG",
      reasoning: "Transfer exceeded 30% budget allocation limit for Operations class",
      dataUsed: ["Treasury balance", "Budget policies", "Transfer history"],
      confidence: 0.96,
      outcome: "blocked",
      humanOverride: true,
      policyReference: "POLICY-019: Treasury spending limits"
    }
  ];

  const filteredDecisions = filter === "all" 
    ? decisions 
    : decisions.filter(d => d.outcome === filter);

  const stats = {
    total: decisions.length,
    avgConfidence: decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length,
    overrideRate: (decisions.filter(d => d.humanOverride).length / decisions.length) * 100,
    successRate: (decisions.filter(d => d.outcome === 'success').length / decisions.length) * 100
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'success':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      case 'blocked':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Explainability Center</h1>
        <p className="text-white/60">Transparent AI decision reasoning and audit trail • ISO 22989, ISO 42001, SOC 2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Decisions"
          value={stats.total}
          icon={Brain}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Avg Confidence"
          value={`${(stats.avgConfidence * 100).toFixed(1)}%`}
          icon={Lightbulb}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Override Rate"
          value={`${stats.overrideRate.toFixed(1)}%`}
          icon={Eye}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Success Rate"
          value={`${stats.successRate.toFixed(0)}%`}
          icon={CheckCircle2}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">AI Decision Log</h3>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
                <TabsTrigger value="success" className="data-[state=active]:bg-white/20">Success</TabsTrigger>
                <TabsTrigger value="blocked" className="data-[state=active]:bg-white/20">Blocked</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-white/20">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            {filteredDecisions.map((decision) => (
              <GlassCard key={decision.id} hover className="border-l-4 border-[#3B82F6]">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{decision.action}</h4>
                        <Badge variant="outline" className={getOutcomeColor(decision.outcome)}>
                          {decision.outcome}
                        </Badge>
                        <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30">
                          {(decision.confidence * 100).toFixed(0)}% confidence
                        </Badge>
                        {decision.humanOverride && (
                          <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                            Human Override
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/60 mb-3">
                        {format(decision.timestamp, 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-[#00d4ff]" />
                        <span className="text-sm font-semibold text-white">Reasoning</span>
                      </div>
                      <p className="text-sm text-white/80">{decision.reasoning}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-[#8B5CF6]" />
                        <span className="text-sm font-semibold text-white">Data Sources Used</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {decision.dataUsed.map((source, idx) => (
                          <Badge key={idx} variant="outline" className="bg-white/5 border-white/20 text-white/70">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {decision.policyReference && (
                      <div className="p-4 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />
                          <span className="text-sm font-semibold text-white">Policy Compliance</span>
                        </div>
                        <p className="text-sm text-white/80">{decision.policyReference}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Trace
                    </Button>
                    <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                      Export Evidence
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}