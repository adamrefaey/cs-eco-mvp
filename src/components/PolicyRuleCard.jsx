import React from "react";
import { Shield, CheckCircle2, AlertTriangle, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import GlassCard from "./GlassCard";

export default function PolicyRuleCard({ 
  policyName, 
  condition, 
  action, 
  status = "active",
  lastTriggered,
  triggeredCount = 0,
  owner 
}) {
  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return { color: "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30", icon: CheckCircle2 };
      case "pending":
        return { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: Clock };
      case "violated":
        return { color: "bg-red-500/20 text-red-300 border-red-500/30", icon: AlertTriangle };
      default:
        return { color: "bg-white/20 text-white/70 border-white/30", icon: Shield };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <GlassCard hover>
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#3B82F6]/20">
              <Shield className="w-5 h-5 text-[#8B5CF6]" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">{policyName}</h4>
              <p className="text-xs text-white/60 mb-2">
                <span className="font-semibold text-[#00d4ff]">IF</span> {condition} 
                <span className="font-semibold text-[#b388ff] ml-2">THEN</span> {action}
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${statusConfig.color} border flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-white/50 text-xs mb-1">Triggered</p>
            <p className="text-white font-semibold">{triggeredCount}x</p>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Last Event</p>
            <p className="text-white font-semibold">
              {lastTriggered || 'Never'}
            </p>
          </div>
          <div>
            <p className="text-white/50 text-xs mb-1">Owner</p>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3 text-white/60" />
              <p className="text-white font-semibold text-xs">{owner || 'System'}</p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}