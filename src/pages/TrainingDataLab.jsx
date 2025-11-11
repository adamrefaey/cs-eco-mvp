import React, { useState } from "react";
import { Brain, CheckCircle2, XCircle, Tag, Filter, ThumbsUp, ThumbsDown } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function TrainingDataLab() {
  const [filter, setFilter] = useState("pending");

  const trainingData = [
    {
      id: "td-001",
      scenario: "Oracle latency > 90s with no update in 120s",
      aiAction: "Trigger fallback oracle",
      humanFeedback: "Approved - correct decision",
      outcome: "success",
      confidence: 91,
      status: "approved",
      tags: ["oracle", "fallback", "latency"],
      pattern: "oracle_failure_recovery"
    },
    {
      id: "td-002",
      scenario: "Contract error rate 6.2% for 10+ minutes",
      aiAction: "Auto-pause contract",
      humanFeedback: "Approved - threshold correctly applied",
      outcome: "success",
      confidence: 94,
      status: "approved",
      tags: ["contract", "error", "pause"],
      pattern: "contract_health_management"
    },
    {
      id: "td-003",
      scenario: "Treasury transfer 50K LMNG to operations wallet",
      aiAction: "Block transfer - exceeds 30% budget limit",
      humanFeedback: "Override - emergency operational need",
      outcome: "override",
      confidence: 96,
      status: "pending_review",
      tags: ["treasury", "budget", "override"],
      pattern: "budget_policy_enforcement"
    }
  ];

  const filteredData = filter === "all"
    ? trainingData
    : trainingData.filter(d => d.status === filter);

  const stats = {
    total: trainingData.length,
    approved: trainingData.filter(d => d.status === 'approved').length,
    pendingReview: trainingData.filter(d => d.status === 'pending_review').length,
    avgConfidence: trainingData.reduce((sum, d) => sum + d.confidence, 0) / trainingData.length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending_review':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Training Data Lab</h1>
        <p className="text-white/60">Curate, tag, and approve AI training data • ISO 42001, ISO 22989, Human-in-the-Loop</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Samples"
          value={stats.total}
          icon={Brain}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Pending Review"
          value={stats.pendingReview}
          icon={Filter}
          gradient="from-yellow-500 to-yellow-700"
        />
        <MetricCard
          title="Avg Confidence"
          value={`${stats.avgConfidence.toFixed(0)}%`}
          icon={ThumbsUp}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Training Data Queue</h3>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
                <TabsTrigger value="pending_review" className="data-[state=active]:bg-white/20">Pending</TabsTrigger>
                <TabsTrigger value="approved" className="data-[state=active]:bg-white/20">Approved</TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-white/20">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            {filteredData.map((data) => (
              <div key={data.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className={getStatusColor(data.status)}>
                        {data.status.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant="outline" className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
                        Pattern: {data.pattern}
                      </Badge>
                      <span className="text-xs text-white/60">Confidence: {data.confidence}%</span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="p-4 rounded-lg bg-white/5">
                        <p className="text-xs text-white/60 mb-1">SCENARIO</p>
                        <p className="text-white text-sm">{data.scenario}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                        <p className="text-xs text-white/60 mb-1">AI ACTION</p>
                        <p className="text-white text-sm">{data.aiAction}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
                        <p className="text-xs text-white/60 mb-1">HUMAN FEEDBACK</p>
                        <p className="text-white text-sm">{data.humanFeedback}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {data.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="bg-white/10 border-white/20 text-white/70">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {data.status === 'pending_review' && (
                      <div className="flex gap-3">
                        <Button size="sm" className="bg-[#39ff14]/20 hover:bg-[#39ff14]/30 text-[#39ff14] border border-[#39ff14]/30">
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Approve for Training
                        </Button>
                        <Button size="sm" className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30">
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                          Add Notes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">ISO 42001 Compliance</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
              <CheckCircle2 className="w-5 h-5 text-[#39ff14] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Human Oversight</p>
              <p className="text-xs text-white/70">All training data reviewed by humans</p>
            </div>
            <div className="p-4 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
              <Tag className="w-5 h-5 text-[#3B82F6] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Data Tagging</p>
              <p className="text-xs text-white/70">Structured labeling for quality control</p>
            </div>
            <div className="p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
              <Brain className="w-5 h-5 text-[#8B5CF6] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Pattern Learning</p>
              <p className="text-xs text-white/70">Categorized by decision patterns</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}