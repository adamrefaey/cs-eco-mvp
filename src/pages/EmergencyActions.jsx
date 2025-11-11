import React, { useState } from "react";
import { AlertTriangle, Power, Pause, StopCircle, Shield, FileText } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function EmergencyActions() {
  const [confirmationText, setConfirmationText] = useState("");
  const [justification, setJustification] = useState("");

  const emergencyActions = [
    {
      id: "em-001",
      name: "Emergency System Halt",
      description: "Stop all AI agents, pause all contracts, freeze treasury operations",
      severity: "critical",
      confirmationPhrase: "HALT ALL SYSTEMS",
      requiredRole: "admin",
      fallbackAction: "Auto-resume after 1 hour if no response",
      iso: "ISO 27002 A.16"
    },
    {
      id: "em-002",
      name: "AI Agent Emergency Stop",
      description: "Disable all autonomous AI decision-making immediately",
      severity: "high",
      confirmationPhrase: "STOP AI AGENTS",
      requiredRole: "admin",
      fallbackAction: "Manual approval required to re-enable",
      iso: "ISO 42001"
    },
    {
      id: "em-003",
      name: "Contract Pause All",
      description: "Pause all smart contract operations on-chain",
      severity: "high",
      confirmationPhrase: "PAUSE CONTRACTS",
      requiredRole: "admin",
      fallbackAction: "Resume after security review",
      iso: "ISO 27034"
    },
    {
      id: "em-004",
      name: "Treasury Freeze",
      description: "Block all outgoing treasury transactions",
      severity: "medium",
      confirmationPhrase: "FREEZE TREASURY",
      requiredRole: "admin",
      fallbackAction: "Manual review for each transaction",
      iso: "ISO 38505-1"
    }
  ];

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: StopCircle };
      case 'high':
        return { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', icon: AlertTriangle };
      case 'medium':
        return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Pause };
      default:
        return { color: 'bg-white/20 text-white/70 border-white/30', icon: Power };
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Emergency Actions</h1>
        <p className="text-white/60">Kill-switch controls with audit-logged justifications • ISO 27002, ISO 42001, SOC 2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Emergency Actions"
          value={emergencyActions.length}
          icon={AlertTriangle}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Critical Level"
          value={emergencyActions.filter(a => a.severity === 'critical').length}
          icon={StopCircle}
          gradient="from-[#ff6b9d] to-[#cc5678]"
        />
        <MetricCard
          title="Total Invocations"
          value="0"
          icon={Power}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Avg Response Time"
          value="N/A"
          icon={Shield}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
      </div>

      <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/30">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-red-300 mb-2">Warning: High-Impact Actions</h3>
            <p className="text-sm text-white/80 mb-3">
              These actions have immediate, system-wide impact. All emergency actions require:
            </p>
            <ul className="text-sm text-white/70 space-y-1 list-disc list-inside">
              <li>Admin role authentication</li>
              <li>Confirmation phrase input</li>
              <li>Written justification (audit-logged)</li>
              <li>Automatic incident report generation</li>
            </ul>
          </div>
        </div>
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Available Emergency Actions</h3>
          <div className="space-y-4">
            {emergencyActions.map((action) => {
              const severityConfig = getSeverityConfig(action.severity);
              const SeverityIcon = severityConfig.icon;

              return (
                <div key={action.id} className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${
                        action.severity === 'critical' ? 'bg-red-500/20' :
                        action.severity === 'high' ? 'bg-orange-500/20' :
                        'bg-yellow-500/20'
                      }`}>
                        <SeverityIcon className={`w-6 h-6 ${
                          action.severity === 'critical' ? 'text-red-400' :
                          action.severity === 'high' ? 'text-orange-400' :
                          'text-yellow-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{action.name}</h4>
                          <Badge variant="outline" className={severityConfig.color}>
                            {action.severity}
                          </Badge>
                          <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                            {action.iso}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/70 mb-4">{action.description}</p>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-[#3B82F6] mt-0.5 flex-shrink-0" />
                            <span className="text-white/60">
                              Required Role: <span className="text-white font-semibold">{action.requiredRole}</span>
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <FileText className="w-4 h-4 text-[#8B5CF6] mt-0.5 flex-shrink-0" />
                            <span className="text-white/60">
                              Fallback: <span className="text-white">{action.fallbackAction}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className={`ml-4 ${
                          action.severity === 'critical'
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30'
                            : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30'
                        }`}>
                          Execute
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0F1117] border-red-500/30 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-red-400">⚠️ Confirm Emergency Action</DialogTitle>
                          <DialogDescription className="text-white/70">
                            {action.name} - This action cannot be undone automatically
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 my-4">
                          <div>
                            <label className="text-sm text-white/70 mb-2 block">
                              Type "{action.confirmationPhrase}" to confirm
                            </label>
                            <Input
                              value={confirmationText}
                              onChange={(e) => setConfirmationText(e.target.value)}
                              placeholder={action.confirmationPhrase}
                              className="bg-white/10 border-white/20 text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-sm text-white/70 mb-2 block">
                              Justification (required for audit log)
                            </label>
                            <Textarea
                              value={justification}
                              onChange={(e) => setJustification(e.target.value)}
                              placeholder="Explain why this emergency action is necessary..."
                              className="bg-white/10 border-white/20 text-white h-24"
                            />
                          </div>

                          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <p className="text-xs text-yellow-300 mb-2">What will happen:</p>
                            <p className="text-sm text-white/80">{action.description}</p>
                            <p className="text-xs text-white/60 mt-2">Fallback: {action.fallbackAction}</p>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            disabled={confirmationText !== action.confirmationPhrase || !justification.trim()}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                          >
                            Execute Emergency Action
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">ISO 27002 Compliance</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
              <Shield className="w-5 h-5 text-[#3B82F6] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Multi-Factor Confirmation</p>
              <p className="text-xs text-white/70">Phrase + justification required</p>
            </div>
            <div className="p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
              <FileText className="w-5 h-5 text-[#8B5CF6] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Audit Trail</p>
              <p className="text-xs text-white/70">All actions logged with justification</p>
            </div>
            <div className="p-4 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
              <Power className="w-5 h-5 text-[#39ff14] mb-2" />
              <p className="text-sm text-white font-semibold mb-1">Automatic Fallback</p>
              <p className="text-xs text-white/70">System recovers based on policy</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}