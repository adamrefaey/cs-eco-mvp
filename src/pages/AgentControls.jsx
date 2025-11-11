import React, { useState } from "react";
import { Sliders, Brain, Zap, Shield, Activity, Power } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function AgentControls() {
  const [agents, setAgents] = useState([
    {
      id: "agent-001",
      name: "Contract Monitor",
      enabled: true,
      confidence: 85,
      autonomy: 60,
      model: "GPT-4",
      actions: 247
    },
    {
      id: "agent-002",
      name: "Oracle Validator",
      enabled: true,
      confidence: 90,
      autonomy: 75,
      model: "GPT-4",
      actions: 532
    },
    {
      id: "agent-003",
      name: "Risk Analyzer",
      enabled: true,
      confidence: 80,
      autonomy: 50,
      model: "GPT-4",
      actions: 184
    }
  ]);

  const stats = {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.enabled).length,
    avgConfidence: agents.reduce((sum, a) => sum + a.confidence, 0) / agents.length,
    totalActions: agents.reduce((sum, a) => sum + a.actions, 0)
  };

  const toggleAgent = (id) => {
    setAgents(agents.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Agent Controls</h1>
        <p className="text-white/60">Configure AI agents, thresholds, and behavior parameters • ISO 22989, ISO 42001</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Agents"
          value={stats.totalAgents}
          icon={Brain}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Active Agents"
          value={stats.activeAgents}
          icon={Activity}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Avg Confidence"
          value={`${stats.avgConfidence.toFixed(0)}%`}
          icon={Shield}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Total Actions"
          value={stats.totalActions}
          icon={Zap}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">AI Agent Configuration</h3>
          <div className="space-y-6">
            {agents.map((agent) => (
              <div key={agent.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      agent.enabled 
                        ? 'bg-gradient-to-br from-[#39ff14]/20 to-[#2ecc11]/20'
                        : 'bg-white/10'
                    }`}>
                      <Brain className={`w-6 h-6 ${agent.enabled ? 'text-[#39ff14]' : 'text-white/40'}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{agent.name}</h4>
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70">
                          {agent.model}
                        </Badge>
                        <Badge variant="outline" className={
                          agent.enabled 
                            ? 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30'
                            : 'bg-white/20 text-white/70 border-white/30'
                        }>
                          {agent.enabled ? 'ACTIVE' : 'PAUSED'}
                        </Badge>
                        <span className="text-sm text-white/60">{agent.actions} actions</span>
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={agent.enabled}
                    onCheckedChange={() => toggleAgent(agent.id)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white/70">Confidence Threshold</span>
                      <span className="text-sm font-semibold text-white">{agent.confidence}%</span>
                    </div>
                    <Slider
                      value={[agent.confidence]}
                      min={0}
                      max={100}
                      step={5}
                      className="mb-2"
                      disabled={!agent.enabled}
                    />
                    <p className="text-xs text-white/50">Minimum confidence for autonomous actions</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white/70">Autonomy Level</span>
                      <span className="text-sm font-semibold text-white">{agent.autonomy}%</span>
                    </div>
                    <Slider
                      value={[agent.autonomy]}
                      min={0}
                      max={100}
                      step={10}
                      className="mb-2"
                      disabled={!agent.enabled}
                    />
                    <p className="text-xs text-white/50">Degree of autonomous decision-making</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Global Controls</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 border-red-500/50 hover:bg-red-500/20">
              <div className="flex flex-col items-center gap-2">
                <Power className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Emergency Stop All</span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4 border-[#3B82F6]/50 hover:bg-[#3B82F6]/20">
              <div className="flex flex-col items-center gap-2">
                <Sliders className="w-5 h-5 text-[#3B82F6]" />
                <span>Reset to Defaults</span>
              </div>
            </Button>
            <Button variant="outline" className="h-auto py-4 border-[#39ff14]/50 hover:bg-[#39ff14]/20">
              <div className="flex flex-col items-center gap-2">
                <Brain className="w-5 h-5 text-[#39ff14]" />
                <span className="text-[#39ff14]">Enable All Agents</span>
              </div>
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}