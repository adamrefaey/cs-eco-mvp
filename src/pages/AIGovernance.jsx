import React from "react";
import { Brain, Shield, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AIGovernance() {
  const aiSystems = [
    {
      name: "Contract Monitor AI",
      purpose: "Autonomous contract health monitoring",
      riskLevel: "medium",
      fairnessScore: 92,
      transparencyScore: 88,
      accountabilityScore: 95,
      humanOversight: true,
      lastAudit: "2 weeks ago",
      iso: "ISO 42001"
    },
    {
      name: "Oracle Validator AI",
      purpose: "Real-time oracle feed validation",
      riskLevel: "high",
      fairnessScore: 96,
      transparencyScore: 91,
      accountabilityScore: 98,
      humanOversight: true,
      lastAudit: "1 week ago",
      iso: "ISO 42001"
    },
    {
      name: "Risk Analysis AI",
      purpose: "Predictive risk assessment",
      riskLevel: "low",
      fairnessScore: 89,
      transparencyScore: 94,
      accountabilityScore: 92,
      humanOversight: true,
      lastAudit: "3 weeks ago",
      iso: "ISO 42001"
    }
  ];

  const stats = {
    totalSystems: aiSystems.length,
    highRisk: aiSystems.filter(s => s.riskLevel === 'high').length,
    avgTransparency: aiSystems.reduce((sum, s) => sum + s.transparencyScore, 0) / aiSystems.length,
    humanOversight: aiSystems.filter(s => s.humanOversight).length
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
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">AI Governance</h1>
        <p className="text-white/60">AI system oversight, ethics, and ISO 42001 compliance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="AI Systems"
          value={stats.totalSystems}
          icon={Brain}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="High Risk"
          value={stats.highRisk}
          icon={AlertTriangle}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Avg Transparency"
          value={`${stats.avgTransparency.toFixed(0)}%`}
          icon={FileText}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Human Oversight"
          value={`${stats.humanOversight}/${stats.totalSystems}`}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">AI Systems (ISO 42001 Framework)</h3>
          <div className="space-y-4">
            {aiSystems.map((system, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{system.name}</h4>
                    <p className="text-sm text-white/60 mb-3">{system.purpose}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className={getRiskColor(system.riskLevel)}>
                        {system.riskLevel} risk
                      </Badge>
                      <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                        {system.iso}
                      </Badge>
                      {system.humanOversight && (
                        <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30 text-xs">
                          Human Oversight
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-white/60 mb-2">Fairness</p>
                    <Progress value={system.fairnessScore} className="h-2 mb-1" />
                    <p className="text-sm text-white font-semibold">{system.fairnessScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-2">Transparency</p>
                    <Progress value={system.transparencyScore} className="h-2 mb-1" />
                    <p className="text-sm text-white font-semibold">{system.transparencyScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-2">Accountability</p>
                    <Progress value={system.accountabilityScore} className="h-2 mb-1" />
                    <p className="text-sm text-white font-semibold">{system.accountabilityScore}%</p>
                  </div>
                </div>

                <p className="text-xs text-white/50 mt-4">Last audit: {system.lastAudit}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}