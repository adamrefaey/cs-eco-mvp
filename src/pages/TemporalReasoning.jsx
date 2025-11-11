import React, { useState, useEffect } from "react";
import { TemporalAnomaly } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Clock, AlertTriangle, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, differenceInMinutes } from "date-fns";

export default function TemporalReasoning() {
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = async () => {
    const data = await TemporalAnomaly.list("-created_date", 50);
    setAnomalies(data);
  };

  const stats = {
    total: anomalies.length,
    critical: anomalies.filter(a => a.severity === 'critical').length,
    autoCorrected: anomalies.filter(a => a.auto_corrected).length,
    avgTimeliness: anomalies.length > 0 
      ? anomalies.reduce((sum, a) => sum + (a.timeliness_score || 0), 0) / anomalies.length 
      : 0
  };

  const getAnomalyColor = (type) => {
    switch (type) {
      case 'delayed':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'missing':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'early':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'duplicate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
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
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Temporal Reasoning Engine</h1>
        <p className="text-white/60">Detect delayed, missing, or early events based on historical expectations • ISO 25023, ISO 27001 A.12.4</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Anomalies"
          value={stats.total}
          icon={Clock}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Critical"
          value={stats.critical}
          icon={AlertTriangle}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Auto-Corrected"
          value={stats.autoCorrected}
          icon={Zap}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Avg Timeliness"
          value={`${stats.avgTimeliness.toFixed(1)}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="+3.2%"
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Detected Temporal Anomalies</h3>
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <div 
                key={anomaly.id}
                className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      anomaly.severity === 'critical' ? 'bg-red-500/20' :
                      anomaly.severity === 'high' ? 'bg-orange-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      <Clock className={`w-5 h-5 ${
                        anomaly.severity === 'critical' ? 'text-red-400' :
                        anomaly.severity === 'high' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getAnomalyColor(anomaly.anomaly_type)}>
                          {anomaly.anomaly_type}
                        </Badge>
                        <Badge variant="outline" className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity}
                        </Badge>
                        {anomaly.auto_corrected && (
                          <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30">
                            Auto-Corrected
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs">
                          Timeliness: {anomaly.timeliness_score || 0}%
                        </Badge>
                      </div>
                      <p className="text-white font-medium mb-2">
                        {anomaly.entity_type} • {anomaly.entity_id}
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-white/70">
                        <div>
                          <span className="text-white/50">Expected:</span>{' '}
                          <span className="text-white">{format(new Date(anomaly.expected_time), 'MMM d, HH:mm:ss')}</span>
                        </div>
                        {anomaly.actual_time && (
                          <div>
                            <span className="text-white/50">Actual:</span>{' '}
                            <span className="text-white">{format(new Date(anomaly.actual_time), 'MMM d, HH:mm:ss')}</span>
                          </div>
                        )}
                      </div>
                      {anomaly.delay_minutes !== undefined && (
                        <p className="text-sm text-white/70 mt-2">
                          Delay: <span className={`font-semibold ${anomaly.delay_minutes > 0 ? 'text-orange-400' : 'text-blue-400'}`}>
                            {anomaly.delay_minutes > 0 ? '+' : ''}{anomaly.delay_minutes} minutes
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {anomaly.correction_action && (
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-[#39ff14]/10 to-[#2ecc11]/10 border border-[#39ff14]/20">
                    <p className="text-xs text-white/60 mb-1 font-semibold">CORRECTION ACTION</p>
                    <p className="text-sm text-white/80">{anomaly.correction_action}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {anomalies.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No temporal anomalies detected</p>
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Temporal Analysis Capabilities</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#3B82F6]/10 to-[#6366F1]/10 border border-[#3B82F6]/20">
              <Clock className="w-6 h-6 text-[#3B82F6] mb-3" />
              <h4 className="font-semibold text-white mb-2">Pattern Learning</h4>
              <p className="text-sm text-white/70">Learns expected timing from historical data</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#A855F7]/10 border border-[#8B5CF6]/20">
              <Zap className="w-6 h-6 text-[#8B5CF6] mb-3" />
              <h4 className="font-semibold text-white mb-2">Auto-Correction</h4>
              <p className="text-sm text-white/70">Automatically triggers corrective actions</p>
            </div>
            <div className="p-5 rounded-xl bg-gradient-to-br from-[#39ff14]/10 to-[#2ecc11]/10 border border-[#39ff14]/20">
              <TrendingUp className="w-6 h-6 text-[#39ff14] mb-3" />
              <h4 className="font-semibold text-white mb-2">Timeliness Scoring</h4>
              <p className="text-sm text-white/70">Scores system responsiveness and reliability</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}