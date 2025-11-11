
import React, { useState, useEffect } from "react";
import { ContractMetric, TokenAnalytic, Market, OracleFeed, Alert, AdminLog, User } from "@/api/entities";
import MetricCard from "../components/MetricCard";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import AIInsightCard from "../components/AIInsightCard";
import TrustAuditPanel from "../components/TrustAuditPanel";
import { 
  Activity, 
  Coins, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  Zap,
  Users,
  DollarSign,
  Brain
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [contracts, setContracts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [tokenData, setTokenData] = useState([]);
  const [user, setUser] = useState(null);
  const [viewMode, setViewMode] = useState("overview"); // overview | mission-control

  useEffect(() => {
    loadData();
    loadUser();
  }, []);

  const loadData = async () => {
    const [contractsData, alertsData, logsData, tokenDataResult] = await Promise.all([
      ContractMetric.list("-created_date", 10),
      Alert.filter({ is_resolved: false }, "-created_date", 5),
      AdminLog.list("-created_date", 5),
      TokenAnalytic.list("-created_date", 20)
    ]);
    
    setContracts(contractsData);
    setAlerts(alertsData);
    setRecentActivity(logsData);
    setTokenData(tokenDataResult);
  };

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const totalInvocations = contracts.reduce((sum, c) => sum + (c.daily_invocations || 0), 0);
  const avgGasCost = contracts.length > 0 
    ? contracts.reduce((sum, c) => sum + (c.avg_gas_cost || 0), 0) / contracts.length 
    : 0;
  const totalTVL = contracts.reduce((sum, c) => sum + (c.total_value_locked || 0), 0);

  // AI-generated insights (mock for now)
  const aiInsights = [
    {
      insight: "Average gas usage increased 12% over 7 days. Consider optimizing contract loops or batching transactions.",
      confidence: 0.87,
      actionSuggestion: "Review contracts with >100 daily calls",
      category: "optimization"
    },
    {
      insight: "3 prediction markets remain unresolved past expiry deadline. Compliance review required.",
      confidence: 0.94,
      actionSuggestion: "Escalate to compliance team",
      category: "compliance"
    },
    {
      insight: "Oracle feed ETH/USD showing 15% higher latency than baseline. Fallback mechanism on standby.",
      confidence: 0.91,
      actionSuggestion: "Trigger fallback oracle",
      category: "anomaly"
    }
  ];

  const chartData = tokenData.slice(0, 10).reverse().map((item, i) => ({
    time: i,
    value: item.amount || 0
  }));

  const handleAIAction = async (suggestion) => {
    try {
      await AdminLog.create({
        action: `AI Suggestion Applied: ${suggestion}`,
        endpoint: "/dashboard",
        status: "success",
        user_role: user?.role || "unknown",
        details: `User accepted AI-generated action suggestion`
      });
      alert(`Action applied: ${suggestion}`);
    } catch (error) {
      console.error("Failed to log action:", error);
      alert(`Action applied: ${suggestion}`); // Still inform user about action application
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Mission Control</h1>
          <p className="text-white/60">AI-Powered Infrastructure Governance • ISO 27001/42001 Certified</p>
        </div>
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList className="bg-white/10 border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="mission-control" className="data-[state=active]:bg-white/20">
              <Brain className="w-4 h-4 mr-2" />
              Mission Control
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* AI Insights Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-5 h-5 text-[#3B82F6]" />
          <h2 className="text-xl font-bold text-white">Neural Intelligence Layer</h2>
          <span className="text-xs text-white/50 ml-2">ISO/IEC 42001 AI Management</span>
        </div>
        <div className="grid gap-4">
          {aiInsights.map((insight, idx) => (
            <AIInsightCard
              key={idx}
              insight={insight.insight}
              confidence={insight.confidence}
              actionSuggestion={insight.actionSuggestion}
              category={insight.category}
              onAction={() => handleAIAction(insight.actionSuggestion)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Contract Invocations"
          value={totalInvocations.toLocaleString()}
          icon={Activity}
          trend="up"
          trendValue="+12.5%"
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
        <MetricCard
          title="Avg Gas Cost"
          value={avgGasCost.toFixed(2)}
          suffix="MATIC"
          icon={Zap}
          trend="down"
          trendValue="-3.2%"
          gradient="from-[#b388ff] to-[#8e6bcc]"
        />
        <MetricCard
          title="Total Value Locked"
          value={`$${(totalTVL / 1000).toFixed(1)}K`}
          icon={DollarSign}
          trend="up"
          trendValue="+8.7%"
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Active Alerts"
          value={alerts.length}
          icon={AlertCircle}
          gradient="from-[#ff6b9d] to-[#cc5678]"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">LMNG Token Activity</h3>
                  <p className="text-white/60 text-sm">Last 24 hours</p>
                </div>
                <Link to={createPageUrl("TokenAnalytics")}>
                  <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-[#00d4ff] hover:bg-white/10">
                    View All <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.6)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.3)" 
                    tick={{ fill: 'rgba(255,255,255,0.6)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      backdropFilter: 'blur(10px)'
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00d4ff" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Active Alerts</h3>
                  <p className="text-white/60 text-sm">Requires attention</p>
                </div>
                <Link to={createPageUrl("Alerts")}>
                  <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-[#00d4ff] hover:bg-white/10">
                    View All <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-white/40">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No active alerts</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`w-4 h-4 ${
                            alert.severity === 'critical' ? 'text-red-400' :
                            alert.severity === 'high' ? 'text-orange-400' :
                            'text-yellow-400'
                          }`} />
                          <p className="font-medium text-white">{alert.title}</p>
                        </div>
                        <span className="text-xs text-white/60">
                          {format(new Date(alert.created_date), 'HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-white/60">{alert.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Smart Contracts</h3>
                <Link to={createPageUrl("Contracts")}>
                  <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-[#00d4ff] hover:bg-white/10">
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-3">
                {contracts.slice(0, 4).map((contract) => (
                  <div 
                    key={contract.id} 
                    className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-white text-sm">{contract.contract_name}</p>
                      <StatusBadge status={contract.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>{contract.daily_invocations} calls</span>
                      <span>•</span>
                      <span>{contract.avg_gas_cost?.toFixed(3)} MATIC</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <TrustAuditPanel
            aiActionsCount={47}
            humanActionsCount={153}
            policyComplianceScore={94}
            automationRate={23}
            auditableActionsCount={200}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Recent Activity</h3>
                <p className="text-white/60 text-sm">Admin audit log</p>
              </div>
              <Link to={createPageUrl("AuditLogs")}>
                <Button variant="ghost" size="sm" className="text-[#00d4ff] hover:text-[#00d4ff] hover:bg-white/10">
                  View All <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((log) => (
                <div 
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.status === 'success' ? 'bg-[#39ff14]' :
                    log.status === 'failure' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{log.action}</p>
                    <p className="text-xs text-white/60 truncate">
                      {log.created_by} • {format(new Date(log.created_date), 'MMM d, HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
