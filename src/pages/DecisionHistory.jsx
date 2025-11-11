import React, { useState } from "react";
import { GitBranch, Brain, User, TrendingUp, Filter, Calendar } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function DecisionHistory() {
  const [filter, setFilter] = useState("all");
  const [agent, setAgent] = useState("all");

  const decisions = [
    {
      id: "dec-001",
      timestamp: new Date(Date.now() - 3600000),
      agent: "Contract Monitor",
      decision: "Auto-pause TokenStaking contract",
      confidence: 94,
      human: "approved",
      trustImpact: +2,
      pattern: "contract_health"
    },
    {
      id: "dec-002",
      timestamp: new Date(Date.now() - 7200000),
      agent: "Oracle Validator",
      decision: "Trigger fallback oracle",
      confidence: 91,
      human: "approved",
      trustImpact: +1,
      pattern: "oracle_failure"
    },
    {
      id: "dec-003",
      timestamp: new Date(Date.now() - 10800000),
      agent: "Treasury Monitor",
      decision: "Block 50K LMNG transfer",
      confidence: 96,
      human: "override",
      trustImpact: -3,
      pattern: "budget_policy"
    }
  ];

  const trustScoreData = Array(30).fill(0).map((_, i) => ({
    day: i,
    score: 75 + Math.random() * 20
  }));

  const stats = {
    totalDecisions: decisions.length,
    avgConfidence: decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length,
    overrideRate: (decisions.filter(d => d.human === 'override').length / decisions.length) * 100,
    trustScore: 87
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Decision History</h1>
        <p className="text-white/60">Filterable AI decision graph with trust score analytics • ISO 42001, ISO 25010</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Decisions"
          value={stats.totalDecisions}
          icon={GitBranch}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Avg Confidence"
          value={`${stats.avgConfidence.toFixed(0)}%`}
          icon={Brain}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Override Rate"
          value={`${stats.overrideRate.toFixed(0)}%`}
          icon={User}
          gradient="from-yellow-500 to-yellow-700"
        />
        <MetricCard
          title="Trust Score"
          value={stats.trustScore}
          icon={TrendingUp}
          trend="up"
          trendValue="+3"
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Trust Score Heatmap (30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trustScoreData}>
              <XAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)' }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)' }} domain={[60, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#39ff14" 
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Decision Timeline</h3>
            <div className="flex gap-3">
              <Tabs value={filter} onValueChange={setFilter}>
                <TabsList className="bg-white/10 border border-white/20">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
                  <TabsTrigger value="approved" className="data-[state=active]:bg-white/20">Approved</TabsTrigger>
                  <TabsTrigger value="override" className="data-[state=active]:bg-white/20">Override</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="space-y-4">
            {decisions.map((decision) => (
              <div key={decision.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4 flex-1">
                    <div className="p-3 rounded-xl bg-[#8B5CF6]/20">
                      <Brain className="w-6 h-6 text-[#8B5CF6]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70">
                          {decision.agent}
                        </Badge>
                        <Badge variant="outline" className={
                          decision.human === 'approved'
                            ? 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30'
                            : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                        }>
                          {decision.human}
                        </Badge>
                        <span className="text-xs text-white/60">
                          {format(decision.timestamp, 'MMM d, HH:mm:ss')}
                        </span>
                      </div>
                      <p className="text-white mb-2">{decision.decision}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white/60">
                          Confidence: <span className="text-white font-semibold">{decision.confidence}%</span>
                        </span>
                        <span className="text-white/60">
                          Pattern: <span className="text-white font-semibold">{decision.pattern}</span>
                        </span>
                        <span className={`font-semibold ${
                          decision.trustImpact > 0 ? 'text-[#39ff14]' : 'text-red-400'
                        }`}>
                          Trust {decision.trustImpact > 0 ? '+' : ''}{decision.trustImpact}
                        </span>
                      </div>
                    </div>
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