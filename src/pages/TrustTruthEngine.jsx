import React from "react";
import { Shield, CheckCircle2, AlertTriangle, HelpCircle, TrendingUp } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function TrustTruthEngine() {
  const claims = [
    {
      id: "claim-001",
      claim: "Oracle ETH/USD is 15% slower than baseline",
      status: "proven",
      modelConfidence: 91,
      humanAgreement: 94,
      dataRedundancy: 3,
      overrideRate: 2,
      evidence: ["Latency logs", "Baseline comparison", "Multiple oracle checks"]
    },
    {
      id: "claim-002",
      claim: "Contract error rate indicates memory leak",
      status: "challenged",
      modelConfidence: 73,
      humanAgreement: 45,
      dataRedundancy: 1,
      overrideRate: 38,
      evidence: ["Gas usage logs", "Error patterns"]
    },
    {
      id: "claim-003",
      claim: "Token flow suggests manipulation attempt",
      status: "unknown",
      modelConfidence: 64,
      humanAgreement: null,
      dataRedundancy: 2,
      overrideRate: null,
      evidence: ["Transaction patterns", "Wallet clustering"]
    }
  ];

  const calculateTruthScore = (claim) => {
    const weights = {
      modelConfidence: 0.3,
      humanAgreement: 0.3,
      dataRedundancy: 0.2,
      overrideInverse: 0.2
    };

    const score = (
      (claim.modelConfidence * weights.modelConfidence) +
      ((claim.humanAgreement || 50) * weights.humanAgreement) +
      (Math.min(claim.dataRedundancy * 33, 100) * weights.dataRedundancy) +
      ((100 - (claim.overrideRate || 50)) * weights.overrideInverse)
    );

    return Math.round(score);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'proven':
        return { color: 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30', icon: CheckCircle2 };
      case 'challenged':
        return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: AlertTriangle };
      case 'unknown':
        return { color: 'bg-white/20 text-white/70 border-white/30', icon: HelpCircle };
      default:
        return { color: 'bg-white/20 text-white/70 border-white/30', icon: HelpCircle };
    }
  };

  const stats = {
    totalClaims: claims.length,
    proven: claims.filter(c => c.status === 'proven').length,
    avgTruth: Math.round(claims.reduce((sum, c) => sum + calculateTruthScore(c), 0) / claims.length),
    dataRedundancy: claims.reduce((sum, c) => sum + c.dataRedundancy, 0) / claims.length
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Trust & Truth Engine</h1>
        <p className="text-white/60">Verify all AI claims with multi-dimensional truth scoring • ISO 42001, ISO 25012</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Claims"
          value={stats.totalClaims}
          icon={Shield}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Proven"
          value={`${stats.proven}/${stats.totalClaims}`}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Avg Truth Score"
          value={`${stats.avgTruth}%`}
          icon={TrendingUp}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Data Redundancy"
          value={stats.dataRedundancy.toFixed(1)}
          icon={Shield}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">AI Claims Verification</h3>
          <div className="space-y-4">
            {claims.map((claim) => {
              const truthScore = calculateTruthScore(claim);
              const statusConfig = getStatusConfig(claim.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={claim.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <StatusIcon className="w-5 h-5 text-white" />
                        <Badge variant="outline" className={statusConfig.color}>
                          {claim.status}
                        </Badge>
                      </div>
                      <p className="text-white text-lg mb-4">{claim.claim}</p>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-white/60">Model Confidence</span>
                            <span className="text-sm font-semibold text-white">{claim.modelConfidence}%</span>
                          </div>
                          <Progress value={claim.modelConfidence} className="h-2" />
                        </div>

                        {claim.humanAgreement !== null && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-white/60">Human Agreement</span>
                              <span className="text-sm font-semibold text-white">{claim.humanAgreement}%</span>
                            </div>
                            <Progress value={claim.humanAgreement} className="h-2" />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-white/60">Data Redundancy</span>
                            <span className="text-sm font-semibold text-white">{claim.dataRedundancy} sources</span>
                          </div>
                          <Progress value={Math.min(claim.dataRedundancy * 33, 100)} className="h-2" />
                        </div>

                        {claim.overrideRate !== null && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-white/60">Override Rate</span>
                              <span className="text-sm font-semibold text-white">{claim.overrideRate}%</span>
                            </div>
                            <Progress value={100 - claim.overrideRate} className="h-2" />
                          </div>
                        )}
                      </div>

                      <div className="p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-white">Computed Truth Score</span>
                          <span className={`text-2xl font-bold ${
                            truthScore >= 80 ? 'text-[#39ff14]' :
                            truthScore >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {truthScore}%
                          </span>
                        </div>
                        <Progress value={truthScore} className="h-3" />
                      </div>

                      <div className="mt-4">
                        <p className="text-xs text-white/60 mb-2">EVIDENCE</p>
                        <div className="flex flex-wrap gap-2">
                          {claim.evidence.map((ev, idx) => (
                            <Badge key={idx} variant="outline" className="bg-white/10 border-white/20 text-white/70">
                              {ev}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Truth Verification Methodology</h3>
          <div className="space-y-3 text-sm text-white/80">
            <p><span className="font-semibold text-[#3B82F6]">Model Confidence</span> (30%): AI's certainty in claim</p>
            <p><span className="font-semibold text-[#8B5CF6]">Human Agreement</span> (30%): Expert verification rate</p>
            <p><span className="font-semibold text-[#39ff14]">Data Redundancy</span> (20%): Multiple independent sources</p>
            <p><span className="font-semibold text-[#00d4ff]">Override Inverse</span> (20%): 100 - (times claim was rejected)</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}