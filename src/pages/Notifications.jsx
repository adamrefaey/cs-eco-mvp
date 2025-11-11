import React, { useState } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, X, Filter } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function Notifications() {
  const [filter, setFilter] = useState("all");

  const notifications = [
    {
      id: "not-001",
      type: "ai_decision",
      title: "AI Action: Contract Paused",
      message: "TokenStaking contract was automatically paused due to error rate exceeding 5%",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      severity: "warning"
    },
    {
      id: "not-002",
      type: "security",
      title: "New Login Detected",
      message: "Login from Chrome on MacOS at IP 192.168.1.100",
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      severity: "info"
    },
    {
      id: "not-003",
      type: "system",
      title: "Oracle Feed Recovered",
      message: "ETH/USD oracle feed has been restored to normal operation",
      timestamp: new Date(Date.now() - 10800000),
      read: true,
      severity: "success"
    },
    {
      id: "not-004",
      type: "approval",
      title: "Access Request Pending",
      message: "John Doe (john@company.com) requested Operator access",
      timestamp: new Date(Date.now() - 14400000),
      read: false,
      severity: "info"
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ai_decision':
        return '🧠';
      case 'security':
        return '🔐';
      case 'system':
        return '⚙️';
      case 'approval':
        return '👤';
      default:
        return '📢';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'border-[#39ff14]/30';
      case 'warning':
        return 'border-yellow-500/30';
      case 'error':
        return 'border-red-500/30';
      default:
        return 'border-[#3B82F6]/30';
    }
  };

  const filteredNotifications = filter === "all"
    ? notifications
    : filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    ai: notifications.filter(n => n.type === 'ai_decision').length,
    security: notifications.filter(n => n.type === 'security').length
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Notifications</h1>
          <p className="text-white/60">Stay informed about system activity and AI decisions • ISO 27002 A.12.4</p>
        </div>
        <Button className="bg-white/10 border border-white/20 text-white hover:bg-white/20">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total"
          value={stats.total}
          icon={Bell}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Unread"
          value={stats.unread}
          icon={AlertTriangle}
          gradient="from-[#ff6b9d] to-[#cc5678]"
        />
        <MetricCard
          title="AI Decisions"
          value={stats.ai}
          icon={Bell}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Security"
          value={stats.security}
          icon={Bell}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-white/20">Unread</TabsTrigger>
                <TabsTrigger value="ai_decision" className="data-[state=active]:bg-white/20">AI</TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-white/20">Security</TabsTrigger>
                <TabsTrigger value="system" className="data-[state=active]:bg-white/20">System</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-5 rounded-xl border-l-4 ${getSeverityColor(notification.severity)} ${
                  notification.read ? 'bg-white/5' : 'bg-white/10'
                } border border-white/10 hover:bg-white/15 transition-all`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-white font-semibold">{notification.title}</h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-white/70 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-white/50">
                        {format(notification.timestamp, 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white/50 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No notifications to display</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}