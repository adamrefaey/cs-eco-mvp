import React from "react";
import { GitBranch, Brain, User, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function AIActionsLog() {
  const actions = [
    {
      id: "action-001",
      timestamp: new Date(Date.now() - 3600000),
      aiSuggestion: "Auto-pause Contract: TokenStaking",
      humanAction: "Approved and Applied",
      outcome: "success",
      confidence: 94,
      override: false,
      category: "automation"
    },
    {
      id: "action-002",
      timestamp: new Date(Date.now() - 7200000),
      aiSuggestion: "Trigger Fallback Oracle: ETH/USD",
      humanAction: "Approved and Applied",
      outcome: "success",
      confidence: 91,
      override: false,
      category: "anomaly"
    },
    {
      id: "action-003",
      timestamp: new Date(Date.now() - 10800000),
      aiSuggestion: "Block Treasury Transfer: 50K LMNG",
      humanAction: "Overridden - Manual Approval Given",
      outcome: "override",
      confidence: 96,
      override: true,
      category: "compliance"
    }
  ];

  const stats = {
    totalActions: actions.length,
    aiAccepted: actions.filter(a => !a.override).length,
    overrideRate: (actions.filter(a => a.override).length / actions.length) * 100,
    avgConfidence: actions.reduce((sum, a) => sum + a.confidence, 0) / actions.length
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'success':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      case 'override':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">AI Actions Log</h1>
        <p className="text-white/60">Compare AI vs Human decisions over time • ISO 42001, ISO 27001, SOC 2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Actions"
          value={stats.totalActions}
          icon={GitBranch}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="AI Accepted"
          value={stats.aiAccepted}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Override Rate"
          value={`${stats.overrideRate.toFixed(0)}%`}
          icon={AlertTriangle}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
        <MetricCard
          title="Avg Confidence"
          value={`${stats.avgConfidence.toFixed(0)}%`}
          icon={Brain}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">AI Decision Audit Trail</h3>
          <div className="space-y-4">
            {actions.map((action) => (
              <div key={action.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex gap-3">
                    <div className="p-3 rounded-xl bg-[#8B5CF6]/20">
                      <Brain className="w-5 h-5 text-[#8B5CF6]" />
                    </div>
                    <div className="p-3 rounded-xl bg-[#3B82F6]/20">
                      <User className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={getOutcomeColor(action.outcome)}>
                        {action.outcome}
                      </Badge>
                      <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70 text-xs">
                        Confidence: {action.confidence}%
                      </Badge>
                      <span className="text-xs text-white/50">
                        {format(action.timestamp, 'MMM d, HH:mm')}
                      </span>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-[#8B5CF6] mt-1 flex-shrink-0" />
                        <p className="text-white text-sm">
                          <span className="text-white/60">AI Suggested:</span> {action.aiSuggestion}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-[#3B82F6] mt-1 flex-shrink-0" />
                        <p className="text-white text-sm">
                          <span className="text-white/60">Human Action:</span> {action.humanAction}
                        </p>
                      </div>
                    </div>
                    {action.override && (
                      <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-xs text-yellow-300">
                          ⚠️ Human override - AI suggestion not followed
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}