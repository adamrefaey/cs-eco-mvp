import React, { useState } from "react";
import { TrendingUp, Plus, Settings, Link as LinkIcon, FileText } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MetricsDesign() {
  const [metrics, setMetrics] = useState([
    {
      id: "metric-001",
      name: "Contract Health Score",
      formula: "(success_rate * 0.6) + (gas_efficiency * 0.4)",
      dataSource: ["ContractMetric", "AdminLog"],
      triggerRule: "Alert if < 70%",
      isoClause: "ISO 25010 - Reliability",
      status: "active"
    },
    {
      id: "metric-002",
      name: "AI Trust Score",
      formula: "(accepted_suggestions / total_suggestions) * 100",
      dataSource: ["AIFeedback", "AdminLog"],
      triggerRule: "Retrain if < 75%",
      isoClause: "ISO 42001 - AI Performance",
      status: "active"
    }
  ]);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Metrics Design Lab</h1>
        <p className="text-white/60">Define custom KPIs with visual builders • ISO 25010, ISO 42001</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Custom Metrics"
          value={metrics.length}
          icon={TrendingUp}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Active"
          value={metrics.filter(m => m.status === 'active').length}
          icon={Settings}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Data Sources"
          value="12"
          icon={LinkIcon}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="ISO Aligned"
          value="100%"
          icon={FileText}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Custom Metrics</h3>
            <Button className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Metric
            </Button>
          </div>

          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-semibold text-white">{metric.name}</h4>
                      <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30">
                        {metric.status}
                      </Badge>
                      <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                        {metric.isoClause}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-white/5">
                        <p className="text-xs text-white/60 mb-1">FORMULA</p>
                        <p className="text-white font-mono text-sm">{metric.formula}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
                        <p className="text-xs text-white/60 mb-2">DATA SOURCES</p>
                        <div className="flex flex-wrap gap-2">
                          {metric.dataSource.map((source, idx) => (
                            <Badge key={idx} variant="outline" className="bg-white/10 border-white/20 text-white/70">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-xs text-white/60 mb-1">TRIGGER RULE</p>
                        <p className="text-white text-sm">{metric.triggerRule}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Create New Metric</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Metric Name</label>
              <Input
                placeholder="e.g., Oracle Reliability Score"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Formula</label>
              <Input
                placeholder="e.g., (uptime / total_time) * 100"
                className="bg-white/10 border-white/20 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Data Source</label>
              <Select>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ContractMetric">ContractMetric</SelectItem>
                  <SelectItem value="OracleFeed">OracleFeed</SelectItem>
                  <SelectItem value="TokenAnalytic">TokenAnalytic</SelectItem>
                  <SelectItem value="AdminLog">AdminLog</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Trigger Rule</label>
              <Input
                placeholder="e.g., Alert if < 95%"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">ISO Reference</label>
              <Select>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select ISO clause" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISO 25010">ISO 25010 - Reliability</SelectItem>
                  <SelectItem value="ISO 27001">ISO 27001 - Security</SelectItem>
                  <SelectItem value="ISO 42001">ISO 42001 - AI Management</SelectItem>
                  <SelectItem value="ISO 31000">ISO 31000 - Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90">
              Create Metric
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}