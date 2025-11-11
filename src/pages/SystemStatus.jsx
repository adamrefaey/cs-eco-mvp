import React from "react";
import { Server, Activity, CheckCircle2, AlertTriangle, Zap, Shield, Database, Radio } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function SystemStatus() {
  const systemComponents = [
    {
      name: "Polygon RPC Node",
      status: "online",
      uptime: 99.98,
      latency: 45,
      lastCheck: "30s ago",
      iso: "ISO 27001"
    },
    {
      name: "Chainlink Oracle Network",
      status: "online",
      uptime: 99.95,
      latency: 120,
      lastCheck: "15s ago",
      iso: "ISO 27017"
    },
    {
      name: "PostgreSQL Database",
      status: "online",
      uptime: 99.99,
      latency: 12,
      lastCheck: "10s ago",
      iso: "ISO 27001"
    },
    {
      name: "AI Model API",
      status: "online",
      uptime: 99.92,
      latency: 230,
      lastCheck: "25s ago",
      iso: "ISO 42001"
    },
    {
      name: "IPFS Gateway",
      status: "degraded",
      uptime: 98.5,
      latency: 850,
      lastCheck: "45s ago",
      iso: "ISO 27034"
    },
    {
      name: "Audit Log Service",
      status: "online",
      uptime: 100,
      latency: 18,
      lastCheck: "5s ago",
      iso: "SOC 2"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'offline':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'offline':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Activity className="w-4 h-4 text-white/50" />;
    }
  };

  const overallUptime = systemComponents.reduce((sum, c) => sum + c.uptime, 0) / systemComponents.length;
  const onlineCount = systemComponents.filter(c => c.status === 'online').length;
  const avgLatency = systemComponents.reduce((sum, c) => sum + c.latency, 0) / systemComponents.length;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">System Status</h1>
        <p className="text-white/60">Infrastructure health monitoring and uptime tracking • ISO 27001, ISO 38505-1</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Overall Uptime"
          value={`${overallUptime.toFixed(2)}%`}
          icon={Activity}
          trend="up"
          trendValue="Last 30d"
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Services Online"
          value={`${onlineCount}/${systemComponents.length}`}
          icon={CheckCircle2}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
        <MetricCard
          title="Avg Latency"
          value={`${avgLatency.toFixed(0)}ms`}
          icon={Zap}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Security Status"
          value="Protected"
          icon={Shield}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
      </div>

      <div className="grid gap-4">
        {systemComponents.map((component, idx) => (
          <GlassCard key={idx} hover>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                    component.status === 'online' 
                      ? 'bg-[#39ff14]/20' 
                      : component.status === 'degraded'
                      ? 'bg-yellow-500/20'
                      : 'bg-red-500/20'
                  }`}>
                    {component.name.includes('RPC') && <Server className="w-5 h-5" />}
                    {component.name.includes('Oracle') && <Radio className="w-5 h-5" />}
                    {component.name.includes('Database') && <Database className="w-5 h-5" />}
                    {component.name.includes('AI') && <Zap className="w-5 h-5" />}
                    {component.name.includes('IPFS') && <Database className="w-5 h-5" />}
                    {component.name.includes('Audit') && <Shield className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{component.name}</h3>
                      <Badge variant="outline" className={`${getStatusColor(component.status)} border flex items-center gap-1`}>
                        {getStatusIcon(component.status)}
                        {component.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                        {component.iso}
                      </Badge>
                    </div>
                    <p className="text-xs text-white/60">Last checked: {component.lastCheck}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-white/60 mb-2">Uptime (30d)</p>
                  <div className="flex items-center gap-3">
                    <Progress value={component.uptime} className="flex-1 h-2" />
                    <span className="text-lg font-bold text-white">{component.uptime}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-white/60 mb-2">Latency</p>
                  <div className="flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${
                      component.latency < 100 ? 'text-[#39ff14]' :
                      component.latency < 500 ? 'text-yellow-400' :
                      'text-red-400'
                    }`} />
                    <span className="text-lg font-bold text-white">{component.latency}ms</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-white/60 mb-2">Health Score</p>
                  <span className={`text-lg font-bold ${
                    component.uptime >= 99.9 ? 'text-[#39ff14]' :
                    component.uptime >= 99 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {component.uptime >= 99.9 ? 'Excellent' :
                     component.uptime >= 99 ? 'Good' :
                     'Poor'}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Security Controls Active</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#39ff14]" />
                <span className="font-semibold text-white">TLS Encryption</span>
              </div>
              <p className="text-xs text-white/60">All traffic encrypted end-to-end</p>
            </div>
            <div className="p-4 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-[#39ff14]" />
                <span className="font-semibold text-white">RBAC Enforced</span>
              </div>
              <p className="text-xs text-white/60">Role-based access control active</p>
            </div>
            <div className="p-4 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-[#39ff14]" />
                <span className="font-semibold text-white">Audit Logging</span>
              </div>
              <p className="text-xs text-white/60">All actions tracked and signed</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}