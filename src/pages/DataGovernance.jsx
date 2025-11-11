import React from "react";
import { Database, Shield, CheckCircle2, AlertTriangle, Activity } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function DataGovernance() {
  const dataAssets = [
    {
      name: "User Data",
      quality: 96,
      completeness: 98,
      accuracy: 94,
      timeliness: 97,
      owner: "admin@lumanagi.xyz",
      classification: "Confidential",
      retention: "7 years",
      iso: "ISO 38505-1, GDPR"
    },
    {
      name: "Transaction Records",
      quality: 99,
      completeness: 100,
      accuracy: 99,
      timeliness: 98,
      owner: "operator@lumanagi.xyz",
      classification: "Internal",
      retention: "10 years",
      iso: "ISO 25012, SOC 2"
    },
    {
      name: "Audit Logs",
      quality: 98,
      completeness: 100,
      accuracy: 98,
      timeliness: 100,
      owner: "compliance@lumanagi.xyz",
      classification: "Restricted",
      retention: "7 years",
      iso: "ISO 27001 A.12, SOC 2"
    }
  ];

  const stats = {
    totalAssets: dataAssets.length,
    avgQuality: dataAssets.reduce((sum, a) => sum + a.quality, 0) / dataAssets.length,
    highQuality: dataAssets.filter(a => a.quality >= 95).length,
    fullCompliance: dataAssets.length
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Data Governance</h1>
        <p className="text-white/60">Data quality, stewardship, and ISO 38505-1 compliance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Data Assets"
          value={stats.totalAssets}
          icon={Database}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Avg Quality"
          value={`${stats.avgQuality.toFixed(1)}%`}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="High Quality"
          value={`${stats.highQuality}/${stats.totalAssets}`}
          icon={Activity}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Compliance"
          value="100%"
          icon={Shield}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Data Assets (ISO 25012 Quality Model)</h3>
          <div className="space-y-4">
            {dataAssets.map((asset, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{asset.name}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70">
                        {asset.classification}
                      </Badge>
                      <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                        {asset.iso}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60 mb-1">Quality Score</p>
                    <p className="text-4xl font-bold text-[#39ff14]">{asset.quality}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-white/60 mb-2">Completeness</p>
                    <Progress value={asset.completeness} className="h-2 mb-1" />
                    <p className="text-sm text-white font-semibold">{asset.completeness}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-2">Accuracy</p>
                    <Progress value={asset.accuracy} className="h-2 mb-1" />
                    <p className="text-sm text-white font-semibold">{asset.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-2">Timeliness</p>
                    <Progress value={asset.timeliness} className="h-2 mb-1" />
                    <p className="text-sm text-white font-semibold">{asset.timeliness}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">Retention</p>
                    <p className="text-sm text-white font-semibold">{asset.retention}</p>
                  </div>
                </div>

                <p className="text-sm text-white/60">Owner: {asset.owner}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}