import React, { useState, useEffect } from "react";
import { Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, PieChart as PieChartIcon } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TreasuryOps() {
  const transactions = [
    {
      id: "tx-001",
      type: "inflow",
      amount: 50000,
      from: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      to: "Treasury",
      budgetClass: "operations",
      timestamp: new Date(Date.now() - 3600000),
      policyCompliant: true
    },
    {
      id: "tx-002",
      type: "outflow",
      amount: 15000,
      from: "Treasury",
      to: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      budgetClass: "rewards",
      timestamp: new Date(Date.now() - 7200000),
      policyCompliant: true
    },
    {
      id: "tx-003",
      type: "stake",
      amount: 25000,
      from: "Treasury",
      to: "Staking Contract",
      budgetClass: "reserve",
      timestamp: new Date(Date.now() - 10800000),
      policyCompliant: true
    }
  ];

  const stats = {
    totalInflow: transactions.filter(t => t.type === 'inflow').reduce((sum, t) => sum + t.amount, 0),
    totalOutflow: transactions.filter(t => t.type === 'outflow').reduce((sum, t) => sum + t.amount, 0),
    totalStaked: transactions.filter(t => t.type === 'stake').reduce((sum, t) => sum + t.amount, 0),
    nonCompliant: transactions.filter(t => !t.policyCompliant).length
  };

  const budgetDistribution = [
    { name: 'Operations', value: 24, color: '#3B82F6' },
    { name: 'Rewards', value: 35, color: '#39ff14' },
    { name: 'Development', value: 18, color: '#8B5CF6' },
    { name: 'Reserve', value: 23, color: '#00d4ff' }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Treasury Operations</h1>
        <p className="text-white/60">Token flow management and budget policy enforcement • ISO 38505-1, SOC 2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Inflow"
          value={stats.totalInflow.toLocaleString()}
          suffix="LMNG"
          icon={TrendingUp}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Total Outflow"
          value={stats.totalOutflow.toLocaleString()}
          suffix="LMNG"
          icon={TrendingDown}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Total Staked"
          value={stats.totalStaked.toLocaleString()}
          suffix="LMNG"
          icon={Coins}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Policy Violations"
          value={stats.nonCompliant}
          icon={PieChartIcon}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Budget Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RePieChart>
                <Pie
                  data={budgetDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {budgetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Treasury Policies</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">Operations Budget Limit</span>
                  <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30">
                    COMPLIANT
                  </Badge>
                </div>
                <p className="text-xs text-white/60">Max 30% of treasury • Current: 24%</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">Rewards Distribution</span>
                  <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30">
                    COMPLIANT
                  </Badge>
                </div>
                <p className="text-xs text-white/60">Min 20% allocation • Current: 35%</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium text-sm">Reserve Requirements</span>
                  <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30">
                    COMPLIANT
                  </Badge>
                </div>
                <p className="text-xs text-white/60">Min 20% reserve • Current: 23%</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      tx.type === 'inflow' ? 'bg-[#39ff14]/20' :
                      tx.type === 'outflow' ? 'bg-red-500/20' :
                      'bg-[#8B5CF6]/20'
                    }`}>
                      {tx.type === 'inflow' ? (
                        <ArrowDownRight className="w-5 h-5 text-[#39ff14]" />
                      ) : tx.type === 'outflow' ? (
                        <ArrowUpRight className="w-5 h-5 text-red-400" />
                      ) : (
                        <Coins className="w-5 h-5 text-[#8B5CF6]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white">{tx.amount.toLocaleString()} LMNG</span>
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70 text-xs">
                          {tx.budgetClass}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/60">{tx.from} → {tx.to}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    tx.policyCompliant 
                      ? 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }>
                    {tx.policyCompliant ? 'COMPLIANT' : 'VIOLATION'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}