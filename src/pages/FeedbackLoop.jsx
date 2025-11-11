
import React, { useState, useEffect } from "react";
import { AIFeedback } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Brain, ThumbsUp, ThumbsDown, TrendingUp, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

export default function FeedbackLoop() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    const data = await AIFeedback.list("-created_date", 50);
    setFeedback(data);
  };

  const stats = {
    total: feedback.length,
    accepted: feedback.filter(f => f.feedback_type === 'accepted').length,
    rejected: feedback.filter(f => f.feedback_type === 'rejected').length,
    avgHelpfulness: feedback.length > 0 
      ? feedback.reduce((sum, f) => sum + f.helpfulness_score, 0) / feedback.length 
      : 0
  };

  const acceptanceRate = stats.total > 0 ? (stats.accepted / stats.total) * 100 : 0;

  const getFeedbackColor = (type) => {
    switch (type) {
      case 'accepted':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'modified':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'escalated':
        return 'bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">AI Feedback Loop</h1>
        <p className="text-white/60">Learn from human decisions and improve AI suggestions • ISO 42001, ISO 25010</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Feedback"
          value={stats.total}
          icon={Activity}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Accepted"
          value={stats.accepted}
          icon={ThumbsUp}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Rejected"
          value={stats.rejected}
          icon={ThumbsDown}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Avg Helpfulness"
          value={`${stats.avgHelpfulness.toFixed(1)}/5`}
          icon={TrendingUp}
          trend="up"
          trendValue="+0.3"
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Learning Metrics</h3>
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Acceptance Rate</span>
                <span className="text-lg font-bold text-white">{acceptanceRate.toFixed(1)}%</span>
              </div>
              <Progress value={acceptanceRate} className="h-2" />
              <p className="text-xs text-white/50 mt-1">Target: over 80%</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Confidence Accuracy</span>
                <span className="text-lg font-bold text-white">
                  {((feedback.filter(f => f.confidence_accurate).length / Math.max(feedback.length, 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={(feedback.filter(f => f.confidence_accurate).length / Math.max(feedback.length, 1)) * 100} className="h-2" />
              <p className="text-xs text-white/50 mt-1">How often AI confidence matches outcome</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Training Data Quality</span>
                <span className="text-lg font-bold text-white">
                  {((feedback.filter(f => f.will_retrain).length / Math.max(feedback.length, 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={(feedback.filter(f => f.will_retrain).length / Math.max(feedback.length, 1)) * 100} className="h-2" />
              <p className="text-xs text-white/50 mt-1">Usable feedback for model improvement</p>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Feedback History</h3>
          <div className="space-y-3">
            {feedback.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      item.feedback_type === 'accepted' ? 'bg-[#39ff14]/20' :
                      item.feedback_type === 'rejected' ? 'bg-red-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      {item.feedback_type === 'accepted' ? (
                        <ThumbsUp className="w-5 h-5 text-[#39ff14]" />
                      ) : (
                        <ThumbsDown className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getFeedbackColor(item.feedback_type)}>
                          {item.feedback_type}
                        </Badge>
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-xs">
                          Helpfulness: {item.helpfulness_score}/5
                        </Badge>
                        {item.confidence_accurate && (
                          <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                            Confidence Accurate
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-white/60">AI Suggested:</span>{' '}
                          <span className="text-white">{item.ai_action_suggested}</span>
                        </div>
                        <div>
                          <span className="text-white/60">Human Did:</span>{' '}
                          <span className="text-white">{item.human_action_taken}</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/60 mt-2">
                        {format(new Date(item.created_date), 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                </div>

                {item.reasoning && (
                  <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/60 mb-1 font-semibold">REASONING</p>
                    <p className="text-sm text-white/80">{item.reasoning}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {feedback.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No feedback recorded yet</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
