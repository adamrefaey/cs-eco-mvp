import React from "react";
import { Target, AlertTriangle, Shield, TrendingUp, CheckCircle2 } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";

export default function RiskManagement() {
  const risks = [
    {
      id: "RISK-001",
      title: "Oracle Manipulation Attack",
      category: "oracle_failure",
      likelihood: "medium",
      impact: "major",
      riskScore: 15,
      treatment: "mitigate",
      status: "in_progress",
      controls: "Multi-oracle aggregation, deviation monitoring",
      owner: "security@lumanagi.xyz",
      iso: "ISO 31000, ISO 27005"
    },
    {
      id: "RISK-002",
      title: "Smart Contract Exploit",
      category: "smart_contract",
      likelihood: "low",
      impact: "catastrophic",
      riskScore: 10,
      treatment: "mitigate",
      status: "mitigated",
      controls: "Formal verification, audits, bug bounty",
      owner: "security@lumanagi.xyz",
      iso: "ISO 27034, ISO 27001"
    },
    {
      id: "RISK-003",
      title: "Regulatory Compliance Breach",
      category: "regulatory",
      likelihood: "low",
      impact: "major",
      riskScore: 8,
      treatment: "mitigate",
      status: "mitigated",
      controls: "Continuous compliance monitoring, legal review",
      owner: "compliance@lumanagi.xyz",
      iso: "ISO 37301, GDPR"
    }
  ];

  const getLikelihoodColor = (likelihood) => {
    const colors = {
      very_high: "bg-red-500/20 text-red-300 border-red-500/30",
      high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      very_low: "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30"
    };
    return colors[likelihood] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      identified: "bg-white/20 text-white/70 border-white/30",
      in_progress: "bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30",
      mitigated: "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30",
      accepted: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
    };
    return colors[status] || colors.identified;
  };

  const stats = {
    total: risks.length,
    critical: risks.filter(r => r.riskScore >= 15).length,
    mitigated: risks.filter(r => r.status === 'mitigated').length,
    avgScore: risks.reduce((sum, r) => sum + r.riskScore, 0) / risks.length
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Risk Management</h1>
        <p className="text-white/60">Enterprise risk assessment and mitigation tracking • ISO 31000, ISO 27005</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Risks"
          value={stats.total}
          icon={Target}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Critical Risks"
          value={stats.critical}
          icon={AlertTriangle}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Mitigated"
          value={stats.mitigated}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Avg Risk Score"
          value={stats.avgScore.toFixed(1)}
          icon={Shield}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Risk Register (ISO 31000 Aligned)</h3>
          <div className="space-y-4">
            {risks.map((risk) => (
              <div key={risk.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{risk.title}</h4>
                      <Badge variant="outline" className={getLikelihoodColor(risk.likelihood)}>
                        {risk.likelihood} likelihood
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(risk.status)}>
                        {risk.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60 mb-4">Risk ID: {risk.id} • Owner: {risk.owner}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60 mb-1">Risk Score</p>
                    <p className={`text-4xl font-bold ${
                      risk.riskScore >= 15 ? 'text-red-400' :
                      risk.riskScore >= 10 ? 'text-orange-400' :
                      'text-yellow-400'
                    }`}>
                      {risk.riskScore}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-xs text-white/60 mb-1">Category</p>
                    <p className="text-white font-medium">{risk.category.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-xs text-white/60 mb-1">Impact</p>
                    <p className="text-white font-medium">{risk.impact}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-xs text-white/60 mb-1">Treatment</p>
                    <p className="text-white font-medium">{risk.treatment}</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10 mb-3">
                  <p className="text-xs text-white/60 mb-1">Controls in Place</p>
                  <p className="text-white text-sm">{risk.controls}</p>
                </div>

                <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                  {risk.iso}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}