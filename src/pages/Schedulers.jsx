import React, { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle2, XCircle, PlayCircle, PauseCircle, AlertTriangle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, differenceInMinutes } from "date-fns";

export default function Schedulers() {
  const schedulers = [
    {
      id: "sch-001",
      name: "Market Resolution Check",
      schedule: "Every 1 hour",
      lastRun: new Date(Date.now() - 3600000),
      nextRun: new Date(Date.now() + 3600000),
      status: "active",
      successRate: 98.5,
      avgDuration: 45,
      failedRuns: 2
    },
    {
      id: "sch-002",
      name: "Oracle Feed Refresh",
      schedule: "Every 5 minutes",
      lastRun: new Date(Date.now() - 300000),
      nextRun: new Date(Date.now() + 300000),
      status: "active",
      successRate: 99.8,
      avgDuration: 12,
      failedRuns: 1
    },
    {
      id: "sch-003",
      name: "Compliance Report Export",
      schedule: "Daily at 00:00 UTC",
      lastRun: new Date(Date.now() - 86400000),
      nextRun: new Date(Date.now() + 86400000 - (Date.now() % 86400000)),
      status: "active",
      successRate: 100,
      avgDuration: 180,
      failedRuns: 0
    },
    {
      id: "sch-004",
      name: "Gas Price Optimization",
      schedule: "Every 15 minutes",
      lastRun: new Date(Date.now() - 900000),
      nextRun: new Date(Date.now() + 900000),
      status: "paused",
      successRate: 95.2,
      avgDuration: 30,
      failedRuns: 8
    },
    {
      id: "sch-005",
      name: "Staking Rewards Distribution",
      schedule: "Every 24 hours",
      lastRun: new Date(Date.now() - 7200000),
      nextRun: new Date(Date.now() + 79200000),
      status: "active",
      successRate: 99.1,
      avgDuration: 120,
      failedRuns: 3
    }
  ];

  const stats = {
    total: schedulers.length,
    active: schedulers.filter(s => s.status === 'active').length,
    avgSuccess: schedulers.reduce((sum, s) => sum + s.successRate, 0) / schedulers.length,
    totalFailed: schedulers.reduce((sum, s) => sum + s.failedRuns, 0)
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { color: 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30', icon: PlayCircle };
      case 'paused':
        return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: PauseCircle };
      case 'failed':
        return { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: XCircle };
      default:
        return { color: 'bg-white/20 text-white/70 border-white/30', icon: Clock };
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Job Schedulers</h1>
        <p className="text-white/60">Automated contract jobs and recurring operations • ISO 20000-1, ISO 27002</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Jobs"
          value={stats.total}
          icon={Calendar}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Active Jobs"
          value={stats.active}
          icon={PlayCircle}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Avg Success Rate"
          value={`${stats.avgSuccess.toFixed(1)}%`}
          icon={CheckCircle2}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
        <MetricCard
          title="Failed Runs"
          value={stats.totalFailed}
          icon={AlertTriangle}
          gradient="from-red-500 to-red-700"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Scheduled Jobs</h3>
          <div className="space-y-4">
            {schedulers.map((scheduler) => {
              const statusConfig = getStatusConfig(scheduler.status);
              const StatusIcon = statusConfig.icon;
              const minutesUntilNext = differenceInMinutes(scheduler.nextRun, new Date());

              return (
                <div key={scheduler.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20">
                        <Calendar className="w-5 h-5 text-[#3B82F6]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{scheduler.name}</h4>
                          <Badge variant="outline" className={statusConfig.color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {scheduler.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60 mb-3">{scheduler.schedule}</p>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Last Run</p>
                            <p className="text-sm font-medium text-white">
                              {format(scheduler.lastRun, 'HH:mm:ss')}
                            </p>
                            <p className="text-xs text-white/50">
                              {format(scheduler.lastRun, 'MMM d')}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Next Run</p>
                            <p className="text-sm font-medium text-white">
                              in {minutesUntilNext}min
                            </p>
                            <p className="text-xs text-white/50">
                              {format(scheduler.nextRun, 'HH:mm')}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Success Rate</p>
                            <p className="text-sm font-medium text-[#39ff14]">
                              {scheduler.successRate}%
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-white/5">
                            <p className="text-xs text-white/60 mb-1">Avg Duration</p>
                            <p className="text-sm font-medium text-white">
                              {scheduler.avgDuration}s
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {scheduler.status === 'paused' ? (
                        <Button size="sm" className="bg-[#39ff14]/20 hover:bg-[#39ff14]/30 text-[#39ff14] border border-[#39ff14]/30">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30">
                          <PauseCircle className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      )}
                    </div>
                  </div>
                  {scheduler.failedRuns > 0 && (
                    <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-sm text-red-300">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        {scheduler.failedRuns} failed runs in last 30 days
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}