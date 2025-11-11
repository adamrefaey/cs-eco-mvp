import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Pause } from "lucide-react";

export default function StatusBadge({ status }) {
  const configs = {
    healthy: {
      icon: CheckCircle2,
      color: "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30",
      label: "Healthy"
    },
    active: {
      icon: CheckCircle2,
      color: "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30",
      label: "Active"
    },
    warning: {
      icon: AlertTriangle,
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      label: "Warning"
    },
    stale: {
      icon: AlertTriangle,
      color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      label: "Stale"
    },
    critical: {
      icon: XCircle,
      color: "bg-red-500/20 text-red-300 border-red-500/30",
      label: "Critical"
    },
    error: {
      icon: XCircle,
      color: "bg-red-500/20 text-red-300 border-red-500/30",
      label: "Error"
    },
    paused: {
      icon: Pause,
      color: "bg-white/20 text-white/70 border-white/30",
      label: "Paused"
    },
    closed: {
      icon: XCircle,
      color: "bg-white/20 text-white/70 border-white/30",
      label: "Closed"
    },
    resolved: {
      icon: CheckCircle2,
      color: "bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30",
      label: "Resolved"
    },
    pending_resolution: {
      icon: AlertTriangle,
      color: "bg-[#b388ff]/20 text-[#b388ff] border-[#b388ff]/30",
      label: "Pending"
    }
  };

  const config = configs[status] || configs.healthy;
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} border backdrop-blur-sm flex items-center gap-1 px-3 py-1`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}