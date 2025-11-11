import React, { useState, useEffect } from "react";
import { TokenAnalytic } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Coins, TrendingUp, ArrowUpDown, Flame, Activity } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function TokenAnalytics() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const data = await TokenAnalytic.list("-created_date", 100);
    setAnalytics(data);
  };

  const totalVolume = analytics.reduce((sum, a) => sum + (a.amount || 0), 0);
  const transfers = analytics.filter(a => a.metric_type === 'transfer').length;
  const stakes = analytics.filter(a => a.metric_type === 'stake');
  const rewards = analytics.filter(a => a.metric_type === 'reward');
  
  const totalStaked = stakes.reduce((sum, s) => sum + (s.amount || 0), 0);
  const totalRewards = rewards.reduce((sum, r) => sum + (r.amount || 0), 0);

  const typeDistribution = [
    { name: 'Transfers', value: analytics.filter(a => a.metric_type === 'transfer').length, color: '#00d4ff' },
    { name: 'Stakes', value: stakes.length, color: '#b388ff' },
    { name: 'Rewards', value: rewards.length, color: '#39ff14' },
    { name: 'Burns', value: analytics.filter(a => a.metric_type === 'burn').length, color: '#ff6b9d' },
  ];

  const volumeData = analytics.slice(0, 20).reverse().map((item, i) => ({
    time: format(new Date(item.timestamp), 'HH:mm'),
    amount: item.amount || 0,
    type: item.metric_type
  }));

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">LMNG Token Analytics</h1>
        <p className="text-white/60">Track token flows, staking, and reward distribution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Volume"
          value={totalVolume.toLocaleString()}
          suffix="LMNG"
          icon={Coins}
          trend="up"
          trendValue="+15.3%"
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
        <MetricCard
          title="Total Staked"
          value={totalStaked.toLocaleString()}
          suffix="LMNG"
          icon={TrendingUp}
          trend="up"
          trendValue="+8.2%"
          gradient="from-[#b388ff] to-[#8e6bcc]"
        />
        <MetricCard
          title="Total Rewards"
          value={totalRewards.toLocaleString()}
          suffix="LMNG"
          icon={Activity}
          trend="up"
          trendValue="+12.1%"
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Transfers"
          value={transfers}
          icon={ArrowUpDown}
          gradient="from-[#ff6b9d] to-[#cc5678]"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Token Activity Volume</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={volumeData}>
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#b388ff" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.6)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.6)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(10px)'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#00d4ff" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#volumeGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Activity Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {typeDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-white/80">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/70">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/70">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/70">From</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/70">To</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/70">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-white/70">Tx Hash</th>
                </tr>
              </thead>
              <tbody>
                {analytics.slice(0, 10).map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <Badge 
                        className={`
                          ${tx.metric_type === 'transfer' ? 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30' : ''}
                          ${tx.metric_type === 'stake' ? 'bg-[#b388ff]/20 text-[#b388ff] border-[#b388ff]/30' : ''}
                          ${tx.metric_type === 'reward' ? 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30' : ''}
                          ${tx.metric_type === 'burn' ? 'bg-[#ff6b9d]/20 text-[#ff6b9d] border-[#ff6b9d]/30' : ''}
                          border backdrop-blur-sm
                        `}
                      >
                        {tx.metric_type}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-white font-medium">
                      {tx.amount?.toLocaleString()} LMNG
                    </td>
                    <td className="py-4 px-4 text-white/60 font-mono text-xs">
                      {tx.from_address?.slice(0, 10)}...
                    </td>
                    <td className="py-4 px-4 text-white/60 font-mono text-xs">
                      {tx.to_address?.slice(0, 10)}...
                    </td>
                    <td className="py-4 px-4 text-white/60 text-sm">
                      {format(new Date(tx.timestamp), 'MMM d, HH:mm')}
                    </td>
                    <td className="py-4 px-4">
                      {tx.tx_hash && (
                        <a 
                          href={`https://polygonscan.com/tx/${tx.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00d4ff] hover:text-[#00aacc] text-xs font-mono"
                        >
                          {tx.tx_hash.slice(0, 12)}...
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}