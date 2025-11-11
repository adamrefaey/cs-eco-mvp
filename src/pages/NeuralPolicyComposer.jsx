import React, { useState } from "react";
import { Brain, GitBranch, Plus, Settings, CheckCircle2, XCircle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NeuralPolicyComposer() {
  const [policies, setPolicies] = useState([
    {
      id: "pol-001",
      name: "Oracle Fallback Trigger",
      version: "2.3.0",
      logic: {
        condition: "latency > 90s AND no_update_in > 120s",
        action: "trigger_fallback",
        memory: {
          total_executions: 47,
          success_rate: 98,
          last_override: "2 months ago",
          learned_patterns: ["Primary oracle typically recovers in 3-5min", "Fallback reduces market impact"]
        }
      },
      maturityScore: 94,
      agentConsensus: 96,
      humanConsensus: 91
    }
  ]);

  const renderPolicyTree = (policy) => {
    return (
      <div className="space-y-3">
        <div className="p-4 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-sm font-semibold text-white">CONDITION</span>
          </div>
          <p className="text-white font-mono text-sm">{policy.logic.condition}</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-0.5 h-4 bg-[#8B5CF6]/30" />
        </div>

        <div className="p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-sm font-semibold text-white">ACTION</span>
          </div>
          <p className="text-white font-mono text-sm">{policy.logic.action}</p>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-0.5 h-4 bg-[#39ff14]/30" />
        </div>

        <div className="p-4 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-[#39ff14]" />
            <span className="text-sm font-semibold text-white">POLICY MEMORY</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Total Executions</span>
              <span className="text-white font-semibold">{policy.logic.memory.total_executions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Success Rate</span>
              <span className="text-[#39ff14] font-semibold">{policy.logic.memory.success_rate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Last Override</span>
              <span className="text-white font-semibold">{policy.logic.memory.last_override}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-white/60 mb-2">LEARNED PATTERNS</div>
          {policy.logic.memory.learned_patterns.map((pattern, idx) => (
            <div key={idx} className="flex items-start gap-2 mb-1">
              <span className="text-[#00d4ff]">•</span>
              <span className="text-white text-sm">{pattern}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Neural Policy Composer</h1>
        <p className="text-white/60">Compose policies as logic+memory trees • ISO 42001, IEEE 7000, Self-Learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Active Policies"
          value={policies.length}
          icon={GitBranch}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Avg Maturity"
          value={`${policies[0].maturityScore}%`}
          icon={Brain}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Agent Consensus"
          value={`${policies[0].agentConsensus}%`}
          icon={CheckCircle2}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Human Trust"
          value={`${policies[0].humanConsensus}%`}
          icon={Settings}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Policy Logic Trees</h3>
            <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Compose New Policy
            </Button>
          </div>

          <div className="space-y-6">
            {policies.map((policy) => (
              <div key={policy.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-bold text-white">{policy.name}</h4>
                      <Badge variant="outline" className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
                        v{policy.version}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white/60">
                        Maturity: <span className="text-white font-semibold">{policy.maturityScore}%</span>
                      </span>
                      <span className="text-white/60">
                        Agent Consensus: <span className="text-[#39ff14] font-semibold">{policy.agentConsensus}%</span>
                      </span>
                      <span className="text-white/60">
                        Human Trust: <span className="text-[#3B82F6] font-semibold">{policy.humanConsensus}%</span>
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Policy
                  </Button>
                </div>

                {renderPolicyTree(policy)}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Policy Evolution Insights</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
              <Brain className="w-5 h-5 text-[#39ff14] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Self-Learning</p>
              <p className="text-xs text-white/70">Policies adapt from outcomes and feedback</p>
            </div>
            <div className="p-4 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
              <GitBranch className="w-5 h-5 text-[#3B82F6] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Version Control</p>
              <p className="text-xs text-white/70">Full rollback and diff support</p>
            </div>
            <div className="p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
              <CheckCircle2 className="w-5 h-5 text-[#8B5CF6] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Constitutional Aligned</p>
              <p className="text-xs text-white/70">All policies checked against core rules</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}