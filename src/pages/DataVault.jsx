import React from "react";
import { Lock, Shield, Database, Key, AlertTriangle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function DataVault() {
  const dataCategories = [
    {
      name: "User Personal Data",
      piiFields: ["email", "full_name", "ip_address"],
      encryption: "AES-256",
      retentionPeriod: "7 years",
      gdprCompliant: true,
      lastAccess: "2 hours ago",
      classification: "Confidential"
    },
    {
      name: "Transaction Records",
      piiFields: ["wallet_address"],
      encryption: "AES-256",
      retentionPeriod: "10 years",
      gdprCompliant: true,
      lastAccess: "5 minutes ago",
      classification: "Internal"
    },
    {
      name: "Audit Logs",
      piiFields: ["user_email", "ip_address"],
      encryption: "AES-256",
      retentionPeriod: "7 years",
      gdprCompliant: true,
      lastAccess: "1 minute ago",
      classification: "Restricted"
    }
  ];

  const stats = {
    totalCategories: dataCategories.length,
    encrypted: dataCategories.filter(d => d.encryption).length,
    gdprCompliant: dataCategories.filter(d => d.gdprCompliant).length,
    piiFields: dataCategories.reduce((sum, d) => sum + d.piiFields.length, 0)
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Data Vault</h1>
        <p className="text-white/60">PII tracking, encryption status, and retention management • ISO 27701, ISO 27018, GDPR</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Data Categories"
          value={stats.totalCategories}
          icon={Database}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Encrypted"
          value={`${stats.encrypted}/${stats.totalCategories}`}
          icon={Lock}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="GDPR Compliant"
          value={`${stats.gdprCompliant}/${stats.totalCategories}`}
          icon={Shield}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="PII Fields"
          value={stats.piiFields}
          icon={AlertTriangle}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Data Protection Status (ISO 27701 & GDPR)</h3>
          <div className="space-y-4">
            {dataCategories.map((category, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2">{category.name}</h4>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70">
                        {category.classification}
                      </Badge>
                      <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30">
                        {category.encryption}
                      </Badge>
                      {category.gdprCompliant && (
                        <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                          GDPR Compliant
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-xs text-white/60 mb-2">PII Fields</p>
                    <div className="flex flex-wrap gap-2">
                      {category.piiFields.map((field, i) => (
                        <Badge key={i} variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30 text-xs">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5">
                    <p className="text-xs text-white/60 mb-1">Retention Period</p>
                    <p className="text-white font-semibold">{category.retentionPeriod}</p>
                    <p className="text-xs text-white/50 mt-2">Last access: {category.lastAccess}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/20">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#39ff14]" />
                    <p className="text-sm text-[#39ff14]">All data encrypted at rest and in transit</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}