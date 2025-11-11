import React from "react";
import { Brain, Zap, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import AIInsightCard from "../components/AIInsightCard";
import { Badge } from "@/components/ui/badge";

export default function NeuralIntelligence() {
  const insights = [
    {
      insight: "Contract 'TokenStaking' error rate increased 12% over 7 days. Auto-pause recommended if threshold exceeds 5%.",
      confidence: 0.94,
      actionSuggestion: "Auto-pause contract",
      category: "automation",
      dataPoints: ["Error logs", "Gas trends", "Historical patterns"],
      policyRef: "POLICY-003"
    },
    {
      insight: "Oracle ETH/USD showing 15% higher latency than baseline. Fallback mechanism ready.",
      confidence: 0.91,
      actionSuggestion: "Trigger fallback oracle",
      category: "anomaly",
      dataPoints: ["Oracle latency", "Update frequency", "Network status"],
      policyRef: "POLICY-012"
    },
    {
      insight: "3 prediction markets remain unresolved 48h past expiry. Compliance escalation required.",
      confidence: 0.98,
      actionSuggestion: "Escalate to compliance team",
      category: "compliance",
      dataPoints: ["Market expiry dates", "Resolution status", "Compliance rules"],
      policyRef: "POLICY-007"
    },
    {
      insight: "Gas optimization detected: RewardDistributor loop consuming 23% more gas than optimal pattern.",
      confidence: 0.85,
      actionSuggestion: "Apply gas optimization",
      category: "optimization",
      dataPoints: ["Bytecode analysis", "Gas usage history", "Similar contracts"],
      policyRef: null
    }
  ];

  const stats = {
    totalInsights: insights.length,
    avgConfidence: insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length,
    criticalActions: insights.filter(i => i.confidence > 0.9).length,
    automationRate: 23
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Neural Intelligence Layer</h1>
        <p className="text-white/60">AI-generated actionable insights with explainability • ISO/IEC 42001, ISO 25012, TR 24028</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Active Insights"
          value={stats.totalInsights}
          icon={Brain}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Avg Confidence"
          value={`${(stats.avgConfidence * 100).toFixed(1)}%`}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="High Confidence"
          value={stats.criticalActions}
          icon={AlertTriangle}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
        <MetricCard
          title="Automation Rate"
          value={`${stats.automationRate}%`}
          icon={Zap}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
      </div>

      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <AIInsightCard
            key={idx}
            insight={insight.insight}
            confidence={insight.confidence}
            actionSuggestion={insight.actionSuggestion}
            category={insight.category}
            onAction={() => alert(`Action applied: ${insight.actionSuggestion}`)}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">AI Decision Categories</h3>
            <div className="space-y-3">
              {[
                { category: "Automation", count: 47, color: "from-[#8B5CF6] to-[#A855F7]" },
                { category: "Anomaly Detection", count: 23, color: "from-red-500 to-red-700" },
                { category: "Optimization", count: 31, color: "from-[#39ff14] to-[#2ecc11]" },
                { category: "Compliance", count: 12, color: "from-[#00d4ff] to-[#0099cc]" }
              ].map((cat) => (
                <div key={cat.category} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{cat.category}</span>
                    <Badge variant="outline" className="bg-white/10 border-white/20">
                      {cat.count}
                    </Badge>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${cat.color}`} style={{ width: `${(cat.count / 113) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-6">Model Performance</h3>
            <div className="space-y-4">
              {[
                { metric: "Precision", value: 94.2 },
                { metric: "Recall", value: 91.8 },
                { metric: "F1 Score", value: 93.0 },
                { metric: "Explainability", value: 88.5 }
              ].map((metric) => (
                <div key={metric.metric}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{metric.metric}</span>
                    <span className="text-[#39ff14] font-bold">{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#39ff14] to-[#2ecc11]"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}