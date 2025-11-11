import React from "react";
import { Users, Shield, Link as LinkIcon, CheckCircle2, Activity } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";

export default function IdentityGraph() {
  const entities = [
    {
      id: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      type: "wallet",
      role: "admin",
      reputation: 98,
      connections: 15,
      verified: true,
      lastActive: "2 hours ago"
    },
    {
      id: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      type: "contract",
      role: "staking",
      reputation: 95,
      connections: 234,
      verified: true,
      lastActive: "10 minutes ago"
    },
    {
      id: "0x9876543210fedcba9876543210fedcba98765432",
      type: "validator",
      role: "oracle",
      reputation: 92,
      connections: 45,
      verified: true,
      lastActive: "1 minute ago"
    }
  ];

  const stats = {
    totalEntities: entities.length,
    verified: entities.filter(e => e.verified).length,
    avgReputation: entities.reduce((sum, e) => sum + e.reputation, 0) / entities.length,
    totalConnections: entities.reduce((sum, e) => sum + e.connections, 0)
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'wallet':
        return 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30';
      case 'contract':
        return 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30';
      case 'validator':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Identity Graph</h1>
        <p className="text-white/60">Map wallets, validators, and contracts with trust scores • ISO 24760, ISO 27034</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Entities"
          value={stats.totalEntities}
          icon={Users}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Verified"
          value={`${stats.verified}/${stats.totalEntities}`}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Avg Reputation"
          value={`${stats.avgReputation.toFixed(0)}%`}
          icon={Shield}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Total Connections"
          value={stats.totalConnections}
          icon={LinkIcon}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Identity Graph (ISO 24760 Aligned)</h3>
          <div className="space-y-4">
            {entities.map((entity) => (
              <div key={entity.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className={getTypeColor(entity.type)}>
                        {entity.type}
                      </Badge>
                      <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70">
                        {entity.role}
                      </Badge>
                      {entity.verified && (
                        <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />
                      )}
                    </div>
                    <p className="text-sm font-mono text-white/80 mb-2">{entity.id}</p>
                    <p className="text-xs text-white/60">Last active: {entity.lastActive}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60 mb-1">Reputation</p>
                    <p className="text-3xl font-bold text-[#39ff14]">{entity.reputation}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <LinkIcon className="w-4 h-4" />
                  <span>{entity.connections} connections</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}