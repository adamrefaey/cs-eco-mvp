import React from "react";
import { Users, CheckCircle2, XCircle, Clock, Shield } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

export default function QuorumGovernance() {
  const proposals = [
    {
      id: "prop-001",
      title: "Increase Treasury Operations Budget to 35%",
      proposer: "admin@lumanagi.xyz",
      created: new Date(Date.now() - 86400000),
      deadline: new Date(Date.now() + 172800000),
      quorumRequired: 3,
      votes: [
        { voter: "admin@lumanagi.xyz", vote: "approve", timestamp: new Date(Date.now() - 82800000), signature: "0x1a2b3c..." },
        { voter: "operator1@lumanagi.xyz", vote: "approve", timestamp: new Date(Date.now() - 79200000), signature: "0x4d5e6f..." },
        { voter: "compliance@lumanagi.xyz", vote: "pending", timestamp: null, signature: null }
      ],
      status: "active",
      category: "treasury"
    },
    {
      id: "prop-002",
      title: "Deploy New Staking Contract v2",
      proposer: "operator1@lumanagi.xyz",
      created: new Date(Date.now() - 172800000),
      deadline: new Date(Date.now() + 86400000),
      quorumRequired: 3,
      votes: [
        { voter: "admin@lumanagi.xyz", vote: "approve", timestamp: new Date(Date.now() - 169200000), signature: "0x7g8h9i..." },
        { voter: "operator1@lumanagi.xyz", vote: "approve", timestamp: new Date(Date.now() - 165600000), signature: "0xjaklmn..." },
        { voter: "compliance@lumanagi.xyz", vote: "approve", timestamp: new Date(Date.now() - 162000000), signature: "0xopqrst..." }
      ],
      status: "approved",
      category: "contracts"
    }
  ];

  const stats = {
    activeProposals: proposals.filter(p => p.status === 'active').length,
    approved: proposals.filter(p => p.status === 'approved').length,
    avgQuorum: proposals.reduce((sum, p) => sum + p.quorumRequired, 0) / proposals.length,
    totalVotes: proposals.reduce((sum, p) => sum + p.votes.filter(v => v.vote !== 'pending').length, 0)
  };

  const getVoteColor = (vote) => {
    switch (vote) {
      case 'approve':
        return 'text-[#39ff14]';
      case 'reject':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-white/60';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Quorum Governance</h1>
        <p className="text-white/60">Multi-party approvals with signature logs • ISO 27001, SOC 2, Blockchain Verified</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Active Proposals"
          value={stats.activeProposals}
          icon={Users}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Avg Quorum"
          value={stats.avgQuorum}
          icon={Shield}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Total Votes"
          value={stats.totalVotes}
          icon={Clock}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Active Proposals</h3>
          <div className="space-y-6">
            {proposals.map((proposal) => {
              const approvedVotes = proposal.votes.filter(v => v.vote === 'approve').length;
              const quorumProgress = (approvedVotes / proposal.quorumRequired) * 100;

              return (
                <div key={proposal.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{proposal.title}</h4>
                        <Badge variant="outline" className={
                          proposal.status === 'approved'
                            ? 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30'
                            : proposal.status === 'active'
                            ? 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30'
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                        }>
                          {proposal.status}
                        </Badge>
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70 text-xs">
                          {proposal.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-white/60 mb-4">
                        Proposed by {proposal.proposer} • {format(proposal.created, 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Quorum Progress</span>
                      <span className="text-sm font-semibold text-white">
                        {approvedVotes}/{proposal.quorumRequired} votes
                      </span>
                    </div>
                    <Progress value={quorumProgress} className="h-2" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-white/70 font-semibold">Votes:</p>
                    {proposal.votes.map((vote, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                            {vote.vote === 'approve' ? (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            ) : vote.vote === 'reject' ? (
                              <XCircle className="w-4 h-4 text-white" />
                            ) : (
                              <Clock className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm font-medium">{vote.voter}</p>
                            <p className={`text-xs ${getVoteColor(vote.vote)}`}>
                              {vote.vote === 'pending' ? 'Vote pending' : `Voted: ${vote.vote}`}
                            </p>
                          </div>
                        </div>
                        {vote.signature && (
                          <div className="text-right">
                            <p className="text-xs text-white/60 mb-1">
                              {format(vote.timestamp, 'MMM d, HH:mm')}
                            </p>
                            <p className="text-xs text-white/50 font-mono">{vote.signature}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {proposal.status === 'active' && (
                    <div className="flex gap-3 mt-4">
                      <Button size="sm" className="bg-[#39ff14]/20 hover:bg-[#39ff14]/30 text-[#39ff14] border border-[#39ff14]/30">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button size="sm" className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30">
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}