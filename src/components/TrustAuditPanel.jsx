import React from "react";
import { Shield, CheckCircle2, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import GlassCard from "./GlassCard";
import { Progress } from "@/components/ui/progress";

export default function TrustAuditPanel({ 
  aiActionsCount = 0,
  humanActionsCount = 0,
  policyComplianceScore = 0,
  automationRate = 0,
  auditableActionsCount = 0
}) {
  const totalActions = aiActionsCount + humanActionsCount;
  const aiPercentage = totalActions > 0 ? (aiActionsCount / totalActions) * 100 : 0;

  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#39ff14]/20 to-[#00d4ff]/20">
            <Shield className="w-6 h-6 text-[#39ff14]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Trust & Auditability</h3>
            <p className="text-sm text-white/60">ISO 27001 & 42001 Aligned</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">Policy Compliance (30d)</span>
              <span className="text-lg font-bold text-white">{policyComplianceScore}%</span>
            </div>
            <Progress value={policyComplianceScore} className="h-2" />
            <p className="text-xs text-white/50 mt-1">
              {policyComplianceScore >= 95 ? 'Excellent' : policyComplianceScore >= 80 ? 'Good' : 'Needs Review'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs text-white/60">AI Actions</span>
              </div>
              <p className="text-2xl font-bold text-white">{aiActionsCount}</p>
              <p className="text-xs text-white/50 mt-1">{aiPercentage.toFixed(1)}% of total</p>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />
                <span className="text-xs text-white/60">Human Actions</span>
              </div>
              <p className="text-2xl font-bold text-white">{humanActionsCount}</p>
              <p className="text-xs text-white/50 mt-1">{(100 - aiPercentage).toFixed(1)}% of total</p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-[#8B5CF6]/10 to-[#3B82F6]/10 border border-[#8B5CF6]/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />
                <span className="text-sm font-semibold text-white">Automation Rate</span>
              </div>
              <span className="text-lg font-bold text-[#8B5CF6]">{automationRate}%</span>
            </div>
            <p className="text-xs text-white/60">
              {auditableActionsCount} fully auditable actions in the last 30 days
            </p>
          </div>

          <div className="pt-3 border-t border-white/10">
            <p className="text-xs text-white/50 flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-[#39ff14]" />
              All AI decisions logged with explainability data
            </p>
            <p className="text-xs text-white/50 flex items-center gap-2 mt-1">
              <CheckCircle2 className="w-3 h-3 text-[#39ff14]" />
              Zero-trust verification on every system action
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}