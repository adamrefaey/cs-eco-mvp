
import React, { useState, useEffect, useCallback } from "react";
import { ContractMetric, AdminLog, User } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import ActionMenu from "../components/ActionMenu";
import { FileCode2, Activity, Zap, TrendingUp, ExternalLink, RefreshCw, Pause, Play, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  const loadContracts = useCallback(async () => {
    setIsRefreshing(true);
    const data = await ContractMetric.list("-created_date");
    setContracts(data);
    if (data.length > 0 && !selectedContract) {
      setSelectedContract(data[0]);
    }
    setIsRefreshing(false);
  }, [selectedContract]);

  useEffect(() => {
    loadContracts();
    loadUser();
  }, [loadContracts]);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const handleContractAction = async (contractId, actionId) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;
    
    try {
      const actionLabels = {
        pause: 'Pause Contract',
        resume: 'Resume Contract',
        retry: 'Retry Last Function',
        view_explorer: 'View on Block Explorer'
      };

      if (actionId === 'view_explorer') {
        window.open(`https://polygonscan.com/address/${contract.contract_address}`, '_blank');
        return;
      }

      // Wrap AdminLog.create in its own try-catch to prevent validation errors from blocking the action
      try {
        await AdminLog.create({
          action: `${actionLabels[actionId]}: ${contract.contract_name}`,
          endpoint: `/contracts/${contractId}`,
          status: 'success',
          user_role: user?.role || 'unknown',
          details: `Action performed on contract ${contract.contract_address}`
        });
      } catch (logError) {
        console.error("Failed to log action:", logError);
        // Do not re-throw, allow the main action to proceed
      }

      if (actionId === 'pause') {
        await ContractMetric.update(contractId, { status: 'paused' });
      } else if (actionId === 'resume') {
        await ContractMetric.update(contractId, { status: 'healthy' });
      } else if (actionId === 'retry') {
        console.log(`Simulating retry for contract: ${contract.contract_name}`);
      }

      loadContracts();
      alert(`Action completed: ${actionLabels[actionId]}`);
    } catch (error) {
      console.error("Action failed:", error);
      alert('Action failed: ' + error.message);
    }
  };

  const getContractActions = (contract) => {
    const baseActions = [
      {
        id: 'view_explorer',
        label: 'View on Block Explorer',
        icon: ExternalLink,
        disabled: false
      },
      {
        id: 'retry',
        label: 'Retry Last Function',
        icon: RefreshCw,
        disabled: user?.role !== 'admin',
        separator: true
      }
    ];

    if (contract.status === 'paused') {
      baseActions.push({
        id: 'resume',
        label: 'Resume Contract',
        icon: Play,
        disabled: user?.role !== 'admin'
      });
    } else {
      baseActions.push({
        id: 'pause',
        label: 'Pause Contract',
        icon: Pause,
        danger: true,
        disabled: user?.role !== 'admin'
      });
    }

    return baseActions;
  };

  const mockChartData = Array(12).fill(0).map((_, i) => ({
    time: i,
    invocations: Math.floor(Math.random() * 100) + 50,
    gas: Math.random() * 0.05 + 0.02
  }));

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Smart Contracts</h1>
          <p className="text-white/60">Monitor contract health and performance metrics</p>
        </div>
        <Button 
          onClick={loadContracts}
          disabled={isRefreshing}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GlassCard>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FileCode2 className="w-5 h-5" />
                Deployed Contracts
              </h3>
              <div className="space-y-2">
                {contracts.map((contract) => (
                  <div
                    key={contract.id}
                    onClick={() => setSelectedContract(contract)}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedContract?.id === contract.id
                        ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#b388ff]/20 border border-white/30'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-white text-sm">{contract.contract_name}</p>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={contract.status} />
                        <ActionMenu 
                          actions={getContractActions(contract)}
                          onAction={(actionId) => handleContractAction(contract.id, actionId)}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-white/50 font-mono truncate">
                      {contract.contract_address}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-white/60">
                      <span>{contract.daily_invocations} calls</span>
                      <span>•</span>
                      <span>{contract.error_rate?.toFixed(2)}% errors</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedContract && (
            <>
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedContract.contract_name}</h2>
                      <p className="text-sm text-white/60 font-mono flex items-center gap-2">
                        {selectedContract.contract_address}
                        <a 
                          href={`https://polygonscan.com/address/${selectedContract.contract_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00d4ff] hover:text-[#00aacc]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={selectedContract.status} />
                      <ActionMenu 
                        actions={getContractActions(selectedContract)}
                        onAction={(actionId) => handleContractAction(selectedContract.id, actionId)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-[#00d4ff]" />
                        <p className="text-xs text-white/60">Daily Invocations</p>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {selectedContract.daily_invocations?.toLocaleString()}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-[#b388ff]" />
                        <p className="text-xs text-white/60">Avg Gas Cost</p>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {selectedContract.avg_gas_cost?.toFixed(3)}
                      </p>
                      <p className="text-xs text-white/50">MATIC</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-[#39ff14]" />
                        <p className="text-xs text-white/60">TVL</p>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        ${(selectedContract.total_value_locked / 1000).toFixed(1)}K
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-red-400" />
                        <p className="text-xs text-white/60">Error Rate</p>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {selectedContract.error_rate?.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Performance Metrics</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-white/60 mb-4">Invocations (Last 24h)</p>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={mockChartData}>
                          <defs>
                            <linearGradient id="invocations" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="invocations" 
                            stroke="#00d4ff" 
                            strokeWidth={2}
                            fill="url(#invocations)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <p className="text-sm text-white/60 mb-4">Gas Usage (MATIC)</p>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={mockChartData}>
                          <defs>
                            <linearGradient id="gas" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#b388ff" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#b388ff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                              border: '1px solid rgba(255,255,255,0.2)',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="gas" 
                            stroke="#b388ff" 
                            strokeWidth={2}
                            fill="url(#gas)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Contract Details</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-white/60 mb-1">Last Invocation</p>
                      <p className="text-white font-medium">
                        {selectedContract.last_invocation 
                          ? format(new Date(selectedContract.last_invocation), 'MMM d, yyyy HH:mm:ss')
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60 mb-1">Network</p>
                      <p className="text-white font-medium">Polygon Mainnet</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60 mb-1">Deployment Date</p>
                      <p className="text-white font-medium">
                        {format(new Date(selectedContract.created_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60 mb-1">Compiler Version</p>
                      <p className="text-white font-medium">v0.8.19+commit.7dd6d404</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
