import React from "react";
import { Download, FileText, Database, Shield, Calendar } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Exports() {
  const exportTypes = [
    {
      name: "Compliance Report",
      description: "Full ISO 27001/42001 compliance status with control mappings",
      format: ["PDF", "JSON", "CSV"],
      iso: "ISO 27001",
      lastGenerated: "2 days ago"
    },
    {
      name: "Audit Logs Export",
      description: "Complete audit trail with user actions and timestamps",
      format: ["JSON", "CSV"],
      iso: "SOC 2 Type II",
      lastGenerated: "1 day ago"
    },
    {
      name: "Token Analytics",
      description: "LMNG token flows, staking, rewards, and burn data",
      format: ["CSV", "JSON"],
      iso: "ISO 25012",
      lastGenerated: "6 hours ago"
    },
    {
      name: "Risk Assessment Report",
      description: "Risk register with scores, treatments, and controls",
      format: ["PDF", "JSON"],
      iso: "ISO 31000",
      lastGenerated: "1 week ago"
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Data Exports</h1>
        <p className="text-white/60">Generate compliance reports and audit bundles • ISO 27001 A.18, GDPR, SOC 2</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Export Types"
          value={exportTypes.length}
          icon={FileText}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Total Exports"
          value="147"
          icon={Download}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Last Export"
          value="6h ago"
          icon={Calendar}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Compliance Ready"
          value="100%"
          icon={Shield}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Available Exports</h3>
          <div className="space-y-4">
            {exportTypes.map((exportType, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{exportType.name}</h4>
                    <p className="text-sm text-white/60 mb-3">{exportType.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                        {exportType.iso}
                      </Badge>
                      <span className="text-xs text-white/50">Last generated: {exportType.lastGenerated}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {exportType.format.map((format) => (
                        <Button
                          key={format}
                          size="sm"
                          className="bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/30"
                        >
                          <Download className="w-3 h-3 mr-2" />
                          {format}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90 h-auto py-6">
              <div className="flex flex-col items-center gap-2">
                <Download className="w-6 h-6" />
                <span>Export All Data</span>
              </div>
            </Button>
            <Button className="bg-gradient-to-r from-[#39ff14] to-[#2ecc11] hover:opacity-90 h-auto py-6 text-black">
              <div className="flex flex-col items-center gap-2">
                <Shield className="w-6 h-6" />
                <span>Compliance Bundle</span>
              </div>
            </Button>
            <Button className="bg-gradient-to-r from-[#00d4ff] to-[#0099cc] hover:opacity-90 h-auto py-6">
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-6 h-6" />
                <span>Audit Package</span>
              </div>
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}