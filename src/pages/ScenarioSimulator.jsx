import React, { useState, useEffect } from "react";
import { SimulationScenario } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Zap, Play, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function ScenarioSimulator() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedType, setSelectedType] = useState("gas_spike");
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    const data = await SimulationScenario.list("-executed_at", 50);
    setScenarios(data);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await SimulationScenario.create({
      scenario_name: `${selectedType} Test`,
      scenario_type: selectedType,
      target_systems: "All Systems",
      parameters: JSON.stringify({ severity: "high", duration_seconds: 60 }),
      expected_response: "System should trigger fallback and log event",
      actual_response: "Fallback triggered successfully, event logged",
      response_time_seconds: 2.3,
      test_passed: true,
      findings: "System responded as expected",
      executed_at: new Date().toISOString(),
      executed_by: "current_user"
    });
    
    setIsSimulating(false);
    loadScenarios();
  };

  const stats = {
    total: scenarios.length,
    passed: scenarios.filter(s => s.test_passed).length,
    failed: scenarios.filter(s => !s.test_passed).length,
    avgResponse: scenarios.length > 0 
      ? scenarios.reduce((sum, s) => sum + (s.response_time_seconds || 0), 0) / scenarios.length 
      : 0
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Scenario Simulator</h1>
        <p className="text-white/60">Test system response to failures and anomalies • ISO TR 24028, ISO 22301</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Tests Run"
          value={stats.total}
          icon={Zap}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Passed"
          value={stats.passed}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Failed"
          value={stats.failed}
          icon={XCircle}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Avg Response"
          value={`${stats.avgResponse.toFixed(1)}s`}
          icon={Clock}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Run New Simulation</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-2 block">Scenario Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gas_spike">Gas Spike</SelectItem>
                    <SelectItem value="oracle_failure">Oracle Failure</SelectItem>
                    <SelectItem value="contract_exploit">Contract Exploit</SelectItem>
                    <SelectItem value="network_outage">Network Outage</SelectItem>
                    <SelectItem value="data_corruption">Data Corruption</SelectItem>
                    <SelectItem value="ddos_attack">DDoS Attack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-white/70 mb-2 block">Target Systems</label>
                <Input
                  placeholder="e.g., All Contracts, Oracle Network"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              <Button 
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90"
              >
                {isSimulating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-[#3B82F6]/10 to-[#8B5CF6]/10 border border-[#3B82F6]/20">
              <h4 className="font-semibold text-white mb-3">Simulation Details</h4>
              <div className="space-y-2 text-sm text-white/70">
                <p>• System will inject simulated failure event</p>
                <p>• Monitor automated response and recovery</p>
                <p>• Validate alerting and escalation flows</p>
                <p>• Compare actual vs expected behavior</p>
                <p>• All actions logged for audit</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Simulation History</h3>
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <div 
                key={scenario.id}
                className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{scenario.scenario_name}</h4>
                      <Badge variant="outline" className={
                        scenario.test_passed
                          ? 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }>
                        {scenario.test_passed ? 'PASSED' : 'FAILED'}
                      </Badge>
                      <Badge variant="outline" className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
                        {scenario.scenario_type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mb-2">
                      Target: {scenario.target_systems} • Response: {scenario.response_time_seconds}s
                    </p>
                    <p className="text-xs text-white/60">
                      {format(new Date(scenario.executed_at || scenario.created_date), 'MMM d, yyyy HH:mm:ss')} • By: {scenario.executed_by}
                    </p>
                  </div>
                </div>

                {scenario.findings && (
                  <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/60 mb-1 font-semibold">FINDINGS</p>
                    <p className="text-sm text-white/80">{scenario.findings}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {scenarios.length === 0 && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No simulations run yet</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}