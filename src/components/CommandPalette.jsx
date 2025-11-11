import React, { useState, useEffect } from "react";
import { Search, ArrowRight, Clock, Star } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function CommandPalette({ open, onOpenChange }) {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const allCommands = [
    { type: "page", title: "Dashboard", url: createPageUrl("Dashboard"), category: "Mission Control", icon: "📊" },
    { type: "page", title: "Neural Insights", url: createPageUrl("NeuralIntelligence"), category: "Mission Control", icon: "🧠" },
    { type: "page", title: "Explainability Center", url: createPageUrl("ExplainabilityCenter"), category: "Mission Control", icon: "💡" },
    { type: "page", title: "Policy Engine", url: createPageUrl("Policies"), category: "Mission Control", icon: "📋" },
    { type: "page", title: "Smart Contracts", url: createPageUrl("Contracts"), category: "Operations", icon: "📝" },
    { type: "page", title: "Oracle Feeds", url: createPageUrl("Oracles"), category: "Operations", icon: "📡" },
    { type: "page", title: "Markets", url: createPageUrl("Markets"), category: "Operations", icon: "📈" },
    { type: "page", title: "Token Analytics", url: createPageUrl("TokenAnalytics"), category: "Analytics", icon: "🪙" },
    { type: "page", title: "Deviation Monitor", url: createPageUrl("DeviationMonitor"), category: "Analytics", icon: "📊" },
    { type: "page", title: "Compliance", url: createPageUrl("Compliance"), category: "Security", icon: "🛡️" },
    { type: "page", title: "Security Posture", url: createPageUrl("SecurityPosture"), category: "Security", icon: "🔒" },
    { type: "page", title: "Alerts", url: createPageUrl("Alerts"), category: "Security", icon: "🚨" },
    { type: "page", title: "Audit Logs", url: createPageUrl("AuditLogs"), category: "Security", icon: "📁" },
    { type: "page", title: "Forensics Lab", url: createPageUrl("Forensics"), category: "Advanced", icon: "🔍" },
    { type: "page", title: "Training Data Lab", url: createPageUrl("TrainingDataLab"), category: "Advanced", icon: "🧪" },
    { type: "page", title: "Emergency Actions", url: createPageUrl("EmergencyActions"), category: "Advanced", icon: "🚨" },
    { type: "action", title: "Export Compliance Report", category: "Actions", icon: "📥" },
    { type: "action", title: "Review Pending Markets", category: "Actions", icon: "⏳" },
    { type: "action", title: "Escalate Open Issues", category: "Actions", icon: "⚠️" },
  ];

  const filteredCommands = search
    ? allCommands.filter(cmd =>
        cmd.title.toLowerCase().includes(search.toLowerCase()) ||
        cmd.category.toLowerCase().includes(search.toLowerCase())
      )
    : allCommands.slice(0, 8);

  const handleSelect = (command) => {
    if (command.type === "page" && command.url) {
      navigate(command.url);
      onOpenChange(false);
      setSearch("");
    }
  };

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f0520]/95 backdrop-blur-xl border-white/20 p-0 max-w-2xl">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-white/40" />
            <Input
              placeholder="Search pages, actions, or type a command..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <Badge variant="outline" className="bg-white/10 border-white/20 text-white/60 text-xs">
              Cmd+K
            </Badge>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/60">No results found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((command, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(command)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{command.icon}</span>
                    <div>
                      <p className="text-white font-medium">{command.title}</p>
                      <p className="text-xs text-white/50">{command.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex gap-2 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">Enter</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd> Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}