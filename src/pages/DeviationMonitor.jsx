import React from "react";
import { Activity, AlertTriangle, TrendingUp, Zap, Radio } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DeviationMonitor() {
  const deviations = [
    {
      id: "dev-001",
      type: "Gas Spike",
      baseline: 0.042,
      current: 0.089,
      deviation: 112,
      severity: "high",
      detected: "15 minutes ago",
      source: "Polygon Network"
    },
    {
      id: "dev-002",
      type: "Oracle Latency",
      baseline: 30,
      current: 78,
      deviation: 160,
      severity: "critical",
      detected: "5 minutes ago",
      source: "ETH/USD Feed"
    },
    {
      id: "dev-003",
      type: "Contract Invocations",
      baseline: 234,
      current: 189,
      deviation: -19,
      severity: "medium",
      detected: "1 hour ago",
      source: "TokenStaking"
    }
  ];

  const chartData = Array(20).fill(0).map((_, i) => ({
    time: i,
    baseline: 0.042 + Math.random() * 0.01,
    actual: 0.042 + Math.random() * 0.05
  }));

  const stats = {
    totalDeviations: deviations.length,
    critical: deviations.filter(d => d.severity === 'critical').length,
    avgDeviation: Math.abs(deviations.reduce((sum, d) => sum + d.deviation, 0) / deviations.length),
    resolved: 47
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Deviation Monitor</h1>
        <p className="text-white/60">Detect anomalies in gas, oracles, and system metrics • ISO 27005, ISO 5055, SOC 2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Active Deviations"
          value={stats.totalDeviations}
          icon={Activity}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Critical"
          value={stats.critical}
          icon={AlertTriangle}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Avg Deviation"
          value={`${stats.avgDeviation.toFixed(0)}%`}
          icon={TrendingUp}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Resolved Today"
          value={stats.resolved}
          icon={Zap}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Real-Time Deviation Tracking</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)' }} />
              <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.6)' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px'
                }}
              />
              <Line type="monotone" dataKey="baseline" stroke="#39ff14" strokeWidth={2} dot={false} name="Baseline" />
              <Line type="monotone" dataKey="actual" stroke="#ff6b9d" strokeWidth={2} dot={false} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Active Deviations</h3>
          <div className="space-y-4">
            {deviations.map((deviation) => (
              <div key={deviation.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{deviation.type}</h4>
                      <Badge variant="outline" className={getSeverityColor(deviation.severity)}>
                        {deviation.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60 mb-3">Source: {deviation.source}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60 mb-1">Deviation</p>
                    <p className={`text-3xl font-bold ${
                      deviation.deviation > 0 ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {deviation.deviation > 0 ? '+' : ''}{deviation.deviation}%
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 p-4 rounded-lg bg-white/5">
                  <div>
                    <p className="text-xs text-white/60 mb-1">Baseline</p>
                    <p className="text-white font-semibold">{deviation.baseline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Current</p>
                    <p className="text-white font-semibold">{deviation.current}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Detected</p>
                    <p className="text-white font-semibold">{deviation.detected}</p>
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