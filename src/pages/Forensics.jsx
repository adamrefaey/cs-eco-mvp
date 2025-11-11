import React, { useState } from "react";
import { Search, Clock, Rewind, PlayCircle, AlertTriangle, Database } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";

export default function Forensics() {
  const [selectedTimestamp, setSelectedTimestamp] = useState(Date.now());
  const [replaySpeed, setReplaySpeed] = useState(1);

  const incidents = [
    {
      id: "inc-001",
      timestamp: new Date(Date.now() - 86400000),
      type: "Oracle Failure",
      severity: "critical",
      affectedSystems: ["ETH/USD Feed", "Market Resolution", "Token Pricing"],
      stateChanges: 12,
      aiDecisions: 3,
      humanOverrides: 1
    },
    {
      id: "inc-002",
      timestamp: new Date(Date.now() - 172800000),
      type: "Gas Spike",
      severity: "high",
      affectedSystems: ["Contract Execution", "Treasury Ops"],
      stateChanges: 8,
      aiDecisions: 2,
      humanOverrides: 0
    }
  ];

  const timeline = [
    { time: "14:32:15", event: "Oracle latency spike detected", type: "detection", agent: "Oracle Validator" },
    { time: "14:32:18", event: "AI suggested fallback activation", type: "ai_decision", agent: "Risk Analyzer", confidence: 91 },
    { time: "14:32:22", event: "Human approved fallback", type: "human_action", user: "admin@lumanagi.xyz" },
    { time: "14:32:25", event: "Fallback oracle activated", type: "system_action", result: "success" },
    { time: "14:35:10", event: "Primary oracle restored", type: "recovery", agent: "Oracle Validator" }
  ];

  const stats = {
    totalIncidents: incidents.length,
    avgResolutionTime: "4.5 min",
    aiDecisions: incidents.reduce((sum, i) => sum + i.aiDecisions, 0),
    stateChanges: incidents.reduce((sum, i) => sum + i.stateChanges, 0)
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'detection':
        return 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30';
      case 'ai_decision':
        return 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30';
      case 'human_action':
        return 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30';
      case 'system_action':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      case 'recovery':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Forensics Lab</h1>
        <p className="text-white/60">Timeline playback and incident analysis • ISO 27043, SOC 2, ISO 27037</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Incidents"
          value={stats.totalIncidents}
          icon={AlertTriangle}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Avg Resolution"
          value={stats.avgResolutionTime}
          icon={Clock}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="AI Decisions"
          value={stats.aiDecisions}
          icon={PlayCircle}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="State Changes"
          value={stats.stateChanges}
          icon={Database}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Incident Replay Controls</h3>
          <div className="space-y-6">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Select Timestamp</label>
              <Input
                type="datetime-local"
                className="bg-white/10 border-white/20 text-white"
                value={format(selectedTimestamp, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setSelectedTimestamp(new Date(e.target.value).getTime())}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-white/70">Replay Speed</label>
                <span className="text-white font-semibold">{replaySpeed}x</span>
              </div>
              <Slider
                value={[replaySpeed]}
                min={0.5}
                max={10}
                step={0.5}
                onValueChange={(value) => setReplaySpeed(value[0])}
                className="mb-2"
              />
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/30">
                <Rewind className="w-4 h-4 mr-2" />
                Replay from Start
              </Button>
              <Button className="flex-1 bg-[#39ff14]/20 hover:bg-[#39ff14]/30 text-[#39ff14] border border-[#39ff14]/30">
                <PlayCircle className="w-4 h-4 mr-2" />
                Resume Playback
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Incident History</h3>
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{incident.type}</h4>
                      <Badge variant="outline" className={
                        incident.severity === 'critical' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        'bg-orange-500/20 text-orange-300 border-orange-500/30'
                      }>
                        {incident.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/60 mb-3">
                      {format(incident.timestamp, 'MMM d, yyyy HH:mm:ss')}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span>{incident.stateChanges} state changes</span>
                      <span>•</span>
                      <span>{incident.aiDecisions} AI decisions</span>
                      <span>•</span>
                      <span>{incident.humanOverrides} overrides</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                    <Search className="w-4 h-4 mr-2" />
                    Investigate
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-xs text-white/60 mb-2">Affected Systems</p>
                  <div className="flex flex-wrap gap-2">
                    {incident.affectedSystems.map((system, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white/10 border-white/20 text-white/70">
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Event Timeline (ISO 27043 Digital Evidence)</h3>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#3B82F6]/30" />
            <div className="space-y-4 pl-8">
              {timeline.map((event, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-8 w-6 h-6 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-mono text-sm">{event.time}</span>
                          <Badge variant="outline" className={getEventColor(event.type)}>
                            {event.type.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-white">{event.event}</p>
                        {event.agent && (
                          <p className="text-xs text-white/60 mt-1">Agent: {event.agent}</p>
                        )}
                        {event.confidence && (
                          <p className="text-xs text-white/60 mt-1">Confidence: {event.confidence}%</p>
                        )}
                        {event.user && (
                          <p className="text-xs text-white/60 mt-1">User: {event.user}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}