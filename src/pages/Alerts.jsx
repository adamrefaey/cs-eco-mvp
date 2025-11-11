import React, { useState, useEffect } from "react";
import { Alert as AlertEntity, AdminLog, User } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import { Bell, CheckCircle2, AlertTriangle, XCircle, Clock, Flag } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadAlerts();
    loadUser();
  }, []);

  const loadAlerts = async () => {
    const data = await AlertEntity.list("-created_date");
    setAlerts(data);
  };

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not authenticated or error fetching user:", error);
    }
  };

  const resolveAlert = async (alertId) => {
    setProcessing(alertId);
    const alert = alerts.find(a => a.id === alertId);

    try {
      await AlertEntity.update(alertId, { 
        is_resolved: true, 
        resolved_at: new Date().toISOString() 
      });

      try {
        await AdminLog.create({
          action: `Resolved Alert: ${alert.title}`,
          endpoint: `/alerts/${alertId}`,
          status: 'success',
          user_role: user?.role || 'unknown',
          details: `Alert marked as resolved by ${user?.email}`
        });
      } catch (logError) {
        console.error("Failed to log action:", logError);
      }

      loadAlerts();
    } catch (error) {
      alert('Failed to resolve alert');
      console.error("Error resolving alert:", error);
    } finally {
      setProcessing(null);
    }
  };

  const escalateAlert = async (alertId) => {
    setProcessing(alertId);
    const alertItem = alerts.find(a => a.id === alertId);

    try {
      try {
        await AdminLog.create({
          action: `Escalated Alert: ${alertItem.title}`,
          endpoint: `/alerts/${alertId}/escalate`,
          status: 'warning',
          user_role: user?.role || 'unknown',
          details: `Alert escalated to compliance team by ${user?.email}`
        });
      } catch (logError) {
        console.error("Failed to log action:", logError);
      }

      await AlertEntity.update(alertId, {
        notification_sent: true
      });

      alert('Alert escalated to compliance team');
      loadAlerts();
    } catch (error) {
      alert('Failed to escalate alert');
      console.error("Error escalating alert:", error);
    } finally {
      setProcessing(null);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    setProcessing(alertId);
    const alertItem = alerts.find(a => a.id === alertId);

    try {
      try {
        await AdminLog.create({
          action: `Acknowledged Alert: ${alertItem.title}`,
          endpoint: `/alerts/${alertId}/acknowledge`,
          status: 'success',
          user_role: user?.role || 'unknown',
          details: `Alert acknowledged by ${user?.email}`
        });
      } catch (logError) {
        console.error("Failed to log action:", logError);
      }

      alert('Alert acknowledged');
      loadAlerts();
    } catch (error) {
      alert('Failed to acknowledge alert');
      console.error("Error acknowledging alert:", error);
    } finally {
      setProcessing(null);
    }
  };

  const filteredAlerts = filter === "all" 
    ? alerts 
    : filter === "active"
    ? alerts.filter(a => !a.is_resolved)
    : alerts.filter(a => a.is_resolved);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'contract_error':
        return <XCircle className="w-5 h-5" />;
      case 'oracle_delay':
        return <Clock className="w-5 h-5" />;
      case 'security':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const stats = {
    total: alerts.length,
    active: alerts.filter(a => !a.is_resolved).length,
    critical: alerts.filter(a => !a.is_resolved && a.severity === 'critical').length,
    resolved: alerts.filter(a => a.is_resolved).length
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Alert Management</h1>
        <p className="text-white/60">Monitor system alerts and configure notifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#0099cc] bg-opacity-20">
                <Bell className="w-5 h-5 text-[#00d4ff]" />
              </div>
              <p className="text-white/60 text-sm font-medium">Total Alerts</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#ff6b9d] to-[#cc5678] bg-opacity-20">
                <AlertTriangle className="w-5 h-5 text-[#ff6b9d]" />
              </div>
              <p className="text-white/60 text-sm font-medium">Active</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.active}</p>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-700 bg-opacity-20">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-white/60 text-sm font-medium">Critical</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.critical}</p>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#39ff14] to-[#2ecc11] bg-opacity-20">
                <CheckCircle2 className="w-5 h-5 text-[#39ff14]" />
              </div>
              <p className="text-white/60 text-sm font-medium">Resolved</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.resolved}</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Alert History</h3>
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
                <TabsTrigger value="active" className="data-[state=active]:bg-white/20">Active</TabsTrigger>
                <TabsTrigger value="resolved" className="data-[state=active]:bg-white/20">Resolved</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-4">
            {filteredAlerts.map((alertItem) => (
              <div 
                key={alertItem.id}
                className={`p-6 rounded-xl border transition-all ${
                  alertItem.is_resolved
                    ? 'bg-white/5 border-white/10 opacity-60'
                    : alertItem.severity === 'critical'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl ${
                      alertItem.severity === 'critical' ? 'bg-red-500/20' :
                      alertItem.severity === 'high' ? 'bg-orange-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      {getTypeIcon(alertItem.alert_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-white">{alertItem.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`${getSeverityColor(alertItem.severity)} border backdrop-blur-sm uppercase text-xs`}
                        >
                          {alertItem.severity}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="bg-white/5 border-white/20 text-white/70 text-xs"
                        >
                          {alertItem.alert_type.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                      <p className="text-white/70 mb-3">{alertItem.message}</p>
                      
                      {(alertItem.threshold_value !== undefined && alertItem.current_value !== undefined) && (
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <span className="text-white/60">
                            Threshold: <span className="text-white font-medium">{alertItem.threshold_value}</span>
                          </span>
                          <span className="text-white/60">
                            Current: <span className={`font-medium ${
                              alertItem.current_value > alertItem.threshold_value ? 'text-red-400' : 'text-[#39ff14]'
                            }`}>
                              {alertItem.current_value}
                            </span>
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-white/50">
                        <span>
                          Created {format(new Date(alertItem.created_date), 'MMM d, yyyy HH:mm')}
                        </span>
                        {alertItem.is_resolved && alertItem.resolved_at && (
                          <>
                            <span>•</span>
                            <span className="text-[#39ff14]">
                              Resolved {format(new Date(alertItem.resolved_at), 'MMM d, yyyy HH:mm')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!alertItem.is_resolved && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => acknowledgeAlert(alertItem.id)}
                        disabled={processing === alertItem.id || user?.role === 'user'}
                        size="sm"
                        className="bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/30"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Acknowledge
                      </Button>
                      <Button
                        onClick={() => escalateAlert(alertItem.id)}
                        disabled={processing === alertItem.id || (user?.role !== 'admin' && user?.role !== 'operator')}
                        size="sm"
                        className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30"
                      >
                        <Flag className="w-4 h-4 mr-2" />
                        Escalate
                      </Button>
                      <Button
                        onClick={() => resolveAlert(alertItem.id)}
                        disabled={processing === alertItem.id || (user?.role !== 'admin' && user?.role !== 'operator')}
                        size="sm"
                        className="bg-[#39ff14]/20 hover:bg-[#39ff14]/30 text-[#39ff14] border border-[#39ff14]/30"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No alerts to display</p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}