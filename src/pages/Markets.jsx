import React, { useState, useEffect } from "react";
import { Market } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import { TrendingUp, Users, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function Markets() {
  const [markets, setMarkets] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadMarkets();
  }, []);

  const loadMarkets = async () => {
    const data = await Market.list("-created_date");
    setMarkets(data);
  };

  const filteredMarkets = filter === "all" 
    ? markets 
    : markets.filter(m => m.status === filter);

  const stats = {
    total: markets.length,
    active: markets.filter(m => m.status === 'active').length,
    resolved: markets.filter(m => m.status === 'resolved').length,
    totalVolume: markets.reduce((sum, m) => sum + (m.total_volume || 0), 0)
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Market Lifecycle</h1>
        <p className="text-white/60">Track prediction markets and resolution status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#0099cc] bg-opacity-20">
                <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
              </div>
              <p className="text-white/60 text-sm font-medium">Total Markets</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#39ff14] to-[#2ecc11] bg-opacity-20">
                <Clock className="w-5 h-5 text-[#39ff14]" />
              </div>
              <p className="text-white/60 text-sm font-medium">Active</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.active}</p>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#b388ff] to-[#8e6bcc] bg-opacity-20">
                <CheckCircle2 className="w-5 h-5 text-[#b388ff]" />
              </div>
              <p className="text-white/60 text-sm font-medium">Resolved</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.resolved}</p>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff6b9d] to-[#cc5678] bg-opacity-20">
                <DollarSign className="w-5 h-5 text-[#ff6b9d]" />
              </div>
              <p className="text-white/60 text-sm font-medium">Total Volume</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalVolume.toLocaleString()}</p>
            <p className="text-sm text-white/60 mt-1">LMNG</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">All Markets</h3>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-white/20">Active</TabsTrigger>
                <TabsTrigger value="closed" className="data-[state=active]:bg-white/20">Closed</TabsTrigger>
                <TabsTrigger value="resolved" className="data-[state=active]:bg-white/20">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            {filteredMarkets.map((market) => (
              <div 
                key={market.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{market.title}</h4>
                    <p className="text-sm text-white/60 font-mono mb-3">Market ID: {market.market_id}</p>
                  </div>
                  <StatusBadge status={market.status} />
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-4 h-4 text-[#00d4ff]" />
                      <p className="text-xs text-white/60">Volume</p>
                    </div>
                    <p className="text-lg font-bold text-white">
                      {market.total_volume?.toLocaleString()} LMNG
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-[#b388ff]" />
                      <p className="text-xs text-white/60">Participants</p>
                    </div>
                    <p className="text-lg font-bold text-white">{market.participants}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-[#39ff14]" />
                      <p className="text-xs text-white/60">Created</p>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {format(new Date(market.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-[#ff6b9d]" />
                      <p className="text-xs text-white/60">Closes</p>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {format(new Date(market.closes_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {market.outcome && (
                  <div className="p-4 rounded-lg bg-gradient-to-r from-[#39ff14]/10 to-[#00d4ff]/10 border border-[#39ff14]/20">
                    <p className="text-sm text-white/60 mb-1">Resolution Outcome</p>
                    <p className="text-white font-semibold">{market.outcome}</p>
                    {market.resolved_at && (
                      <p className="text-xs text-white/50 mt-1">
                        Resolved on {format(new Date(market.resolved_at), 'MMM d, yyyy HH:mm')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}