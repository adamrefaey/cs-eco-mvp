import React from "react";
import { Target, AlertTriangle, TrendingUp, Shield, Activity } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";

export default function PredictionRiskMap() {
  const riskAreas = [
    {
      area: "Oracle Trust",
      riskLevel: "medium",
      score: 68,
      factors: ["ETH/USD latency +15%", "BTC/USD deviation detected"],
      mitigation: "Fallback oracle active",
      iso: "ISO 31000"
    },
    {
      area: "Token Volatility",
      riskLevel: "high",
      score: 82,
      factors: ["LMNG price variance +23%", "Unusual trading volume"],
      mitigation: "Treasury rebalancing scheduled",
      iso: "ISO 27005"
    },
    {
      area: "Market Integrity",
      riskLevel: "low",
      score: 24,
      factors: ["3 markets pending resolution"],
      mitigation: "Escalation workflow active",
      iso: "ISO 31000"
    }
  ];

  const stats = {
    totalRisks: riskAreas.length,
    highRisk: riskAreas.filter(r => r.riskLevel === 'high').length,
    avgScore: riskAreas.reduce((sum, r) => sum + r.score, 0) / riskAreas.length,
    mitigated: riskAreas.filter(r => r.mitigation).length
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Prediction Risk Map</h1>
        <p className="text-white/60">Visualize active and predicted risks across markets • ISO 31000, ISO 27005, SOC 2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Risk Areas"
          value={stats.totalRisks}
          icon={Target}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="High Risk"
          value={stats.highRisk}
          icon={AlertTriangle}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Avg Risk Score"
          value={stats.avgScore.toFixed(0)}
          icon={Activity}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Mitigated"
          value={`${stats.mitigated}/${stats.totalRisks}`}
          icon={Shield}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Risk Heatmap (ISO 31000 Aligned)</h3>
          <div className="space-y-4">
            {riskAreas.map((risk, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold text-white">{risk.area}</h4>
                      <Badge variant="outline" className={getRiskColor(risk.riskLevel)}>
                        {risk.riskLevel} risk
                      </Badge>
                      <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                        {risk.iso}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-white/70 font-semibold">Risk Factors:</p>
                      {risk.factors.map((factor, i) => (
                        <p key={i} className="text-sm text-white/60">• {factor}</p>
                      ))}
                    </div>
                    {risk.mitigation && (
                      <div className="p-3 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
                        <p className="text-xs text-white/60 mb-1">MITIGATION ACTIVE</p>
                        <p className="text-sm text-[#39ff14]">{risk.mitigation}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-white/60 mb-1">Risk Score</p>
                    <p className={`text-4xl font-bold ${
                      risk.score >= 70 ? 'text-red-400' :
                      risk.score >= 40 ? 'text-yellow-400' :
                      'text-[#39ff14]'
                    }`}>
                      {risk.score}
                    </p>
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