
import React, { useState, useEffect, useCallback } from "react";
import { AdminLog, User } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import { FileText, Search, Download, Filter, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [user, setUser] = useState(null);

  const loadData = async () => {
    const [logsData, currentUser] = await Promise.all([
      AdminLog.list("-created_date", 100),
      User.me().catch(() => null)
    ]);
    setLogs(logsData);
    setUser(currentUser);
  };

  const applyFilters = useCallback(() => {
    let filtered = logs;

    if (statusFilter !== "all") {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.endpoint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.created_by?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, statusFilter]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Action', 'User', 'Status', 'Endpoint', 'IP Address', 'Details'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        format(new Date(log.created_date), 'yyyy-MM-dd HH:mm:ss'),
        log.action,
        log.created_by,
        log.status,
        log.endpoint || '',
        log.ip_address || '',
        log.details || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-[#39ff14]" />;
      case 'failure':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      case 'failure':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Audit Logs</h1>
          <p className="text-white/60">Full admin activity tracking and compliance reporting</p>
        </div>
        <Button 
          onClick={exportToCSV}
          className="bg-gradient-to-r from-[#00d4ff] to-[#b388ff] hover:opacity-90 text-white border-0"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Search actions, users, endpoints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white/10 border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failure">Failure</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-white/60 mb-4">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredLogs.map((log) => (
              <div 
                key={log.id}
                className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(log.status)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white mb-1">{log.action}</h4>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">{log.created_by}</span>
                          {log.user_role && (
                            <Badge variant="outline" className="ml-1 text-xs bg-white/5 border-white/20 text-white/70">
                              {log.user_role}
                            </Badge>
                          )}
                        </span>
                        <span>•</span>
                        <span>{format(new Date(log.created_date), 'MMM d, yyyy HH:mm:ss')}</span>
                        {log.ip_address && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-xs">{log.ip_address}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(log.status)} border backdrop-blur-sm flex items-center gap-1`}
                  >
                    {log.status}
                  </Badge>
                </div>

                {log.endpoint && (
                  <div className="mt-3 p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-white/50 mb-1">Endpoint</p>
                    <p className="text-sm text-white/80 font-mono">{log.endpoint}</p>
                  </div>
                )}

                {log.details && (
                  <div className="mt-3 p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-white/50 mb-1">Details</p>
                    <p className="text-sm text-white/80">{log.details}</p>
                  </div>
                )}
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No logs found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
