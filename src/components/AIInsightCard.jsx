import React from "react";
import { Brain, TrendingUp, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import GlassCard from "./GlassCard";

export default function AIInsightCard({ 
  insight, 
  confidence, 
  actionSuggestion, 
  onAction, 
  category = "optimization" 
}) {
  const getCategoryIcon = () => {
    switch (category) {
      case "anomaly": return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "optimization": return <TrendingUp className="w-5 h-5 text-[#00d4ff]" />;
      case "compliance": return <CheckCircle className="w-5 h-5 text-[#39ff14]" />;
      default: return <Lightbulb className="w-5 h-5 text-[#b388ff]" />;
    }
  };

  const getConfidenceColor = (score) => {
    if (score >= 0.9) return "text-[#39ff14]";
    if (score >= 0.7) return "text-[#00d4ff]";
    if (score >= 0.5) return "text-yellow-400";
    return "text-orange-400";
  };

  return (
    <GlassCard className="border-l-4 border-[#3B82F6]">
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20">
            <Brain className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getCategoryIcon()}
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs">
                AI Insight
              </Badge>
              <span className={`text-sm font-semibold ${getConfidenceColor(confidence)}`}>
                {(confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed mb-3">{insight}</p>
            {actionSuggestion && (
              <div className="flex items-center gap-3">
                <p className="text-white/70 text-xs flex-1">
                  <span className="font-semibold text-[#00d4ff]">Suggested:</span> {actionSuggestion}
                </p>
                <Button 
                  size="sm" 
                  onClick={onAction}
                  className="bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/30"
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="text-xs text-white/40 flex items-center gap-2">
          <span>Learned from 1,247 similar patterns</span>
          <span>•</span>
          <span>ISO 25012 Data Quality Aligned</span>
        </div>
      </div>
    </GlassCard>
  );
}