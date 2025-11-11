import React, { useState, useEffect } from "react";
import { TrustBoundaryEvent } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Shield, Lock, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function TrustBoundaries() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await TrustBoundaryEvent.list("-created_date", 50);
    setEvents(data);
  };

  const stats = {
    total: events.length,
    allowed: events.filter(e => e.event_type === 'allowed').length,
    blocked: events.filter(e => e.event_type === 'blocked').length,
    avgRisk: events.length > 0 ? events.reduce((sum, e) => sum + (e.risk_score || 0), 0) / events.length : 0
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'allowed':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      case 'blocked':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'escalated':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'verified':
        return 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Trust Boundaries</h1>
        <p className="text-white/60">Zero-trust cross-module interactions and permission enforcement • NIST 800-207, ISO 27017, SOC 2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Interactions"
          value={stats.total}
          icon={Activity}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Allowed"
          value={stats.allowed}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Blocked"
          value={stats.blocked}
          icon={Shield}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Avg Risk Score"
          value={stats.avgRisk.toFixed(1)}
          icon={AlertTriangle}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Zero-Trust Interaction Log</h3>
          <div className="space-y-3">
            {events.map((event) => (
              <div 
                key={event.id}
                className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      event.event_type === 'blocked' ? 'bg-red-500/20' :
                      event.event_type === 'allowed' ? 'bg-[#39ff14]/20' :
                      'bg-yellow-500/20'
                    }`}>
                      {event.event_type === 'blocked' ? (
                        <Shield className="w-5 h-5 text-red-400" />
                      ) : event.event_type === 'allowed' ? (
                        <CheckCircle2 className="w-5 h-5 text-[#39ff14]" />
                      ) : (
                        <Lock className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getEventColor(event.event_type)}>
                          {event.event_type}
                        </Badge>
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs">
                          Risk: {event.risk_score || 0}/100
                        </Badge>
                        <Badge variant="outline" className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30 text-xs">
                          {event.user_role}
                        </Badge>
                      </div>
                      <p className="text-white font-medium mb-2">
                        {event.source_module} → {event.target_module}
                      </p>
                      <p className="text-white/70 text-sm mb-2">
                        Action: <span className="text-white font-medium">{event.action_attempted}</span>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-white/60">
                        <span>{format(new Date(event.created_date), 'MMM d, HH:mm:ss')}</span>
                        <span>•</span>
                        <span>Verification: {event.verification_method}</span>
                        {event.permission_required && (
                          <>
                            <span>•</span>
                            <span>Required: {event.permission_required}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {event.nist_control && (
                  <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 border border-[#3B82F6]/20">
                    <p className="text-xs text-white/60 mb-1 font-semibold">NIST 800-207 CONTROL</p>
                    <p className="text-sm text-white/80">{event.nist_control}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No boundary events recorded</p>
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Zero-Trust Principles</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#3B82F6]/10 to-[#6366F1]/10 border border-[#3B82F6]/20">
              <Shield className="w-6 h-6 text-[#3B82F6] mb-3" />
              <h4 className="font-semibold text-white mb-2">Never Trust, Always Verify</h4>
              <p className="text-sm text-white/70">Every cross-module interaction requires explicit verification</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#A855F7]/10 border border-[#8B5CF6]/20">
              <Lock className="w-6 h-6 text-[#8B5CF6] mb-3" />
              <h4 className="font-semibold text-white mb-2">Least Privilege</h4>
              <p className="text-sm text-white/70">Modules only receive minimum required permissions</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#39ff14]/10 to-[#2ecc11]/10 border border-[#39ff14]/20">
              <Activity className="w-6 h-6 text-[#39ff14] mb-3" />
              <h4 className="font-semibold text-white mb-2">Continuous Monitoring</h4>
              <p className="text-sm text-white/70">All interactions logged and risk-scored in real-time</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}