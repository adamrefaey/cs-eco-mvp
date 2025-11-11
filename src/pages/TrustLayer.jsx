import React from "react";
import GlassCard from "../components/GlassCard";
import TrustAuditPanel from "../components/TrustAuditPanel";
import MetricCard from "../components/MetricCard";
import { Scale, Shield, CheckCircle2, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function TrustLayer() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Trust Layer</h1>
        <p className="text-white/60">Self-audit dashboard and explainability scorecards • ISO 42001 & SOC 2 Type II</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Trust Score"
          value="94.3%"
          icon={Scale}
          trend="up"
          trendValue="+2.1%"
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Auditability"
          value="100%"
          icon={CheckCircle2}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="AI Transparency"
          value="97.2%"
          icon={Activity}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Policy Compliance"
          value="96.8%"
          icon={Shield}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <TrustAuditPanel
          aiActionsCount={47}
          humanActionsCount={153}
          policyComplianceScore={94}
          automationRate={23}
          auditableActionsCount={200}
        />

        <GlassCard>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Self-Audit Scorecard</h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Explainability Coverage</span>
                  <span className="text-lg font-bold text-white">98.5%</span>
                </div>
                <Progress value={98.5} className="h-2" />
                <p className="text-xs text-white/50 mt-1">All AI decisions have logged reasoning</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Audit Trail Completeness</span>
                  <span className="text-lg font-bold text-white">100%</span>
                </div>
                <Progress value={100} className="h-2" />
                <p className="text-xs text-white/50 mt-1">Every action tracked with full context</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Policy Adherence</span>
                  <span className="text-lg font-bold text-white">96.3%</span>
                </div>
                <Progress value={96.3} className="h-2" />
                <p className="text-xs text-white/50 mt-1">7 policy violations in last 30 days</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Security Control Coverage</span>
                  <span className="text-lg font-bold text-white">94.7%</span>
                </div>
                <Progress value={94.7} className="h-2" />
                <p className="text-xs text-white/50 mt-1">ISO 27001 controls implemented</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Trust Principles</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#3B82F6]/10 to-[#6366F1]/10 border border-[#3B82F6]/20">
              <CheckCircle2 className="w-6 h-6 text-[#3B82F6] mb-3" />
              <h4 className="font-semibold text-white mb-2">Explainability</h4>
              <p className="text-sm text-white/70">Every AI decision includes reasoning, data sources, and confidence scores</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#A855F7]/10 border border-[#8B5CF6]/20">
              <Shield className="w-6 h-6 text-[#8B5CF6] mb-3" />
              <h4 className="font-semibold text-white mb-2">Accountability</h4>
              <p className="text-sm text-white/70">Full audit trail of who did what, when, and why with ISO 27001 alignment</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#39ff14]/10 to-[#2ecc11]/10 border border-[#39ff14]/20">
              <Scale className="w-6 h-6 text-[#39ff14] mb-3" />
              <h4 className="font-semibold text-white mb-2">Verifiability</h4>
              <p className="text-sm text-white/70">Users can drill into decisions to verify AI/automation logic at any level</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}