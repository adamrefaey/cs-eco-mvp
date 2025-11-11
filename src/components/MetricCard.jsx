import React from "react";
import GlassCard from "./GlassCard";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  trendValue,
  suffix = "",
  gradient = "from-[#00d4ff] to-[#b388ff]"
}) {
  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-3 h-3" />;
    return trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return "text-white/50";
    return trend === "up" ? "text-[#39ff14]" : "text-red-400";
  };

  return (
    <GlassCard hover className="relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 blur-3xl`} />
      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20 backdrop-blur-sm`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trendValue && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              {trendValue}
            </div>
          )}
        </div>
        <p className="text-white/60 text-sm font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tight">
          {value}
          {suffix && <span className="text-lg text-white/60 ml-1">{suffix}</span>}
        </p>
      </div>
    </GlassCard>
  );
}