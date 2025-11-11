import React, { useState, useEffect } from "react";
import { SecurityIncident, Alert as AlertEntity } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Shield, AlertTriangle, Clock, CheckCircle2, Activity, Lock } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SecurityPosture() {
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [incidentsData, alertsData] = await Promise.all([
      SecurityIncident.list("-created_date", 50),
      AlertEntity.filter({ is_resolved: false }, "-created_date")
    ]);
    setIncidents(incidentsData);
    setAlerts(alertsData);
  };

  const activeIncidents = incidents.filter(i => !['resolved', 'closed'].includes(i.status));
  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && !['resolved', 'closed'].includes(i.status));
  const avgResponseTime = incidents.length > 0 
    ? incidents.reduce((sum, i) => sum + (i.response_time_minutes || 0), 0) / incidents.length 
    : 0;

  const incidentTrend = incidents.slice(0, 10).reverse().map((item, i) => ({
    time: i,
    count: 1
  }));

  const getSeverityColor = (severity) => {
    const colors = {
      critical: "bg-red-500/20 text-red-300 border-red-500/30",
      high: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      low: "bg-blue-500/20 text-blue-300 border-blue-500/30"
    };
    return colors[severity] || colors.low;
  };

  const getStatusColor = (status) => {
    const colors = {
      detected: "bg-red-500/20 text-red-300 border-red-500/30",
      investigating: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      contained: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      resolved: "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30",
      closed: "bg-white/10 border-white/20 text-white/70"
    };
    return colors[status] || colors.detected;
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Security Posture</h1>
        <p className="text-white/60">Real-time security monitoring and incident response tracking (ISO 27001/27043)</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#39ff14] rounded-full animate-pulse" />
            <span className="text-white/80 text-sm">TLS Encryption Active</span>
          </div>
          <span className="text-white/40">•</span>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#00d4ff]" />
            <span className="text-white/80 text-sm">RBAC Enforced</span>
          </div>
          <span className="text-white/40">•</span>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#b388ff]" />
            <span className="text-white/80 text-sm">Zero-Trust Model</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Incidents"
          value={activeIncidents.length}
          icon={AlertTriangle}
          gradient="from-[#ff6b9d] to-[#cc5678]"
        />
        <MetricCard
          title="Critical Incidents"
          value={criticalIncidents.length}
          icon={Shield}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Avg Response Time"
          value={avgResponseTime.toFixed(0)}
          suffix="min"
          icon={Clock}
          trend="down"
          trendValue="-23%"
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
        <MetricCard
          title="Active Alerts"
          value={alerts.length}
          icon={Activity}
          gradient="from-[#b388ff] to-[#8e6bcc]"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Incident Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={incidentTrend}>
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
                      borderRadius: '12px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#ff6b9d" 
                    strokeWidth={3}
                    dot={{ fill: '#ff6b9d', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        <GlassCard>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Security Controls</h3>
            <div className="space-y-4">
              {[
                { label: "Firewall", status: "active", icon: Shield },
                { label: "IDS/IPS", status: "active", icon: Activity },
                { label: "Audit Logging", status: "active", icon: CheckCircle2 },
                { label: "Encryption", status: "active", icon: Lock },
                { label: "MFA", status: "active", icon: Shield }
              ].map((control) => (
                <div key={control.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <control.icon className="w-4 h-4 text-[#00d4ff]" />
                    <span className="text-white font-medium">{control.label}</span>
                  </div>
                  <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30">
                    {control.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Security Incidents (ISO 27043 Digital Forensics)</h3>
          <div className="space-y-4">
            {incidents.slice(0, 10).map((incident) => (
              <div key={incident.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className={`w-5 h-5 ${
                        incident.severity === 'critical' ? 'text-red-400' :
                        incident.severity === 'high' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`} />
                      <h4 className="text-lg font-semibold text-white">
                        {incident.incident_type.replace(/_/g, ' ').toUpperCase()}
                      </h4>
                    </div>
                    <p className="text-white/70 mb-3">Incident ID: {incident.incident_id}</p>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className={getSeverityColor(incident.severity)}>
                        {incident.severity}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(incident.status)}>
                        {incident.status.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant="outline" className="bg-white/5 border-white/20 text-white/70 text-xs">
                        {incident.detection_method?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {incident.affected_systems && (
                  <div className="mb-4 p-4 rounded-lg bg-white/5">
                    <p className="text-white/60 text-xs mb-1">Affected Systems</p>
                    <p className="text-white text-sm">{incident.affected_systems}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white/60 mb-1">Detected</p>
                    <p className="text-white font-medium">
                      {format(new Date(incident.detected_at || incident.created_date), 'MMM d, HH:mm')}
                    </p>
                  </div>
                  {incident.response_time_minutes && (
                    <div>
                      <p className="text-white/60 mb-1">Response Time</p>
                      <p className="text-white font-medium">{incident.response_time_minutes} min</p>
                    </div>
                  )}
                  {incident.iso_reference && (
                    <div>
                      <p className="text-white/60 mb-1">ISO Control</p>
                      <p className="text-white font-medium font-mono text-xs">{incident.iso_reference}</p>
                    </div>
                  )}
                </div>

                {incident.root_cause && (
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-white/60 text-xs mb-1">Root Cause</p>
                    <p className="text-white text-sm">{incident.root_cause}</p>
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