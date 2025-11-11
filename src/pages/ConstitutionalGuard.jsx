import React, { useState } from "react";
import { Shield, AlertTriangle, Lock, CheckCircle2, XCircle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ConstitutionalGuard() {
  const constitutionalRules = [
    {
      id: "const-001",
      name: "Minimum Trust Threshold",
      description: "AI agents cannot execute autonomous actions if trust score < 75%",
      logic: "agent.trust_score >= 75",
      severity: "critical",
      enforcement: "block",
      violations: 0,
      standard: "ISO 42001, IEEE 7000",
      ethicsCategory: "safety"
    },
    {
      id: "const-002",
      name: "Quorum Override Protection",
      description: "Decisions overridden >40% must require human quorum approval",
      logic: "decision.override_rate < 40 OR quorum.approved == true",
      severity: "high",
      enforcement: "escalate",
      violations: 2,
      standard: "ISO 42001, IEEE 7001",
      ethicsCategory: "accountability"
    },
    {
      id: "const-003",
      name: "Constitutional Amendment Protection",
      description: "AI cannot propose changes to constitutional rules themselves",
      logic: "proposal.type != 'constitutional_amendment' OR proposer.type == 'human'",
      severity: "critical",
      enforcement: "block",
      violations: 0,
      standard: "IEEE 7000, Constitutional AI",
      ethicsCategory: "alignment"
    },
    {
      id: "const-004",
      name: "Explainability Mandate",
      description: "All autonomous actions must have explainable justification",
      logic: "decision.explainability_score >= 70",
      severity: "high",
      enforcement: "warn",
      violations: 5,
      standard: "ISO 22989, ISO 42001",
      ethicsCategory: "transparency"
    }
  ];

  const stats = {
    totalRules: constitutionalRules.length,
    critical: constitutionalRules.filter(r => r.severity === 'critical').length,
    totalViolations: constitutionalRules.reduce((sum, r) => sum + r.violations, 0),
    enforcementRate: 100
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  };

  const getEnforcementIcon = (enforcement) => {
    switch (enforcement) {
      case 'block':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'escalate':
        return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />;
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Constitutional Guard</h1>
        <p className="text-white/60">Hard-coded AI alignment rules • IEEE 7000/7001, ISO 42001, Constitutional AI</p>
      </div>

      <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/30">
        <div className="flex items-start gap-4">
          <Lock className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-red-300 mb-2">Immutable Constitutional Framework</h3>
            <p className="text-sm text-white/80 mb-3">
              These rules cannot be overridden by AI agents. They form the ethical and operational boundaries
              of the entire system. Violations are logged and trigger immediate enforcement actions.
            </p>
            <div className="text-sm text-white/70">
              <p>✓ Prevents unethical AI behavior</p>
              <p>✓ Enforces human oversight requirements</p>
              <p>✓ Protects system integrity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Constitutional Rules"
          value={stats.totalRules}
          icon={Shield}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Critical Rules"
          value={stats.critical}
          icon={Lock}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Violations (All Time)"
          value={stats.totalViolations}
          icon={AlertTriangle}
          gradient="from-orange-500 to-orange-700"
        />
        <MetricCard
          title="Enforcement Rate"
          value={`${stats.enforcementRate}%`}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Active Constitutional Rules</h3>
          <div className="space-y-4">
            {constitutionalRules.map((rule) => (
              <div key={rule.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{rule.name}</h4>
                      <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                        {rule.severity}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getEnforcementIcon(rule.enforcement)}
                        <span className="text-xs text-white/70">{rule.enforcement}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/70 mb-4">{rule.description}</p>

                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                        <p className="text-xs text-white/60 mb-1">LOGIC</p>
                        <p className="text-white font-mono text-sm">{rule.logic}</p>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-white/60 mb-1">Ethics Category</p>
                          <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30">
                            {rule.ethicsCategory}
                          </Badge>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-white/60 mb-1">Standard</p>
                          <p className="text-white text-sm font-semibold">{rule.standard}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5">
                          <p className="text-xs text-white/60 mb-1">Violations</p>
                          <p className={`text-2xl font-bold ${rule.violations === 0 ? 'text-[#39ff14]' : 'text-red-400'}`}>
                            {rule.violations}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Constitutional AI Principles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
              <Shield className="w-5 h-5 text-[#39ff14] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Safety First</p>
              <p className="text-xs text-white/70">AI cannot take actions that violate safety thresholds</p>
            </div>
            <div className="p-4 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
              <Lock className="w-5 h-5 text-[#3B82F6] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Human Sovereignty</p>
              <p className="text-xs text-white/70">Humans maintain ultimate control over critical systems</p>
            </div>
            <div className="p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
              <CheckCircle2 className="w-5 h-5 text-[#8B5CF6] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Transparency</p>
              <p className="text-xs text-white/70">All AI decisions must be explainable</p>
            </div>
            <div className="p-4 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20">
              <Shield className="w-5 h-5 text-[#00d4ff] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Alignment</p>
              <p className="text-xs text-white/70">AI goals align with human values and safety</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}