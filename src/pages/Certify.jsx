import React, { useState, useEffect } from "react";
import { ComplianceEvidence } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { FileCheck, Download, CheckCircle2, Clock, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function Certify() {
  const [evidence, setEvidence] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState("all");

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    const data = await ComplianceEvidence.list("-collection_date", 100);
    setEvidence(data);
  };

  const filteredEvidence = selectedStandard === "all" 
    ? evidence 
    : evidence.filter(e => e.standard_id === selectedStandard);

  const stats = {
    total: evidence.length,
    valid: evidence.filter(e => e.status === 'valid').length,
    expired: evidence.filter(e => e.status === 'expired').length,
    pending: evidence.filter(e => e.status === 'pending_review').length
  };

  const generateAuditBundle = async () => {
    // Simulate bundle generation
    alert('Generating comprehensive audit bundle with all evidence...');
    // In real implementation, this would create a downloadable ZIP with all logs, screenshots, and documentation
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
        return 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30';
      case 'expired':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending_review':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'insufficient':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-white/20 text-white/70 border-white/30';
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Certify - Evidence Layer</h1>
          <p className="text-white/60">Downloadable compliance proof and audit bundle generation • ISO 27001, SOC 2 Type II, ISO 27701</p>
        </div>
        <Button 
          onClick={generateAuditBundle}
          className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90"
        >
          <Download className="w-4 h-4 mr-2" />
          Generate Audit Bundle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Evidence"
          value={stats.total}
          icon={FileCheck}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Valid"
          value={stats.valid}
          icon={CheckCircle2}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Expired"
          value={stats.expired}
          icon={Clock}
          gradient="from-red-500 to-red-700"
        />
        <MetricCard
          title="Pending Review"
          value={stats.pending}
          icon={Shield}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Compliance Evidence Repository</h3>
            <Tabs value={selectedStandard} onValueChange={setSelectedStandard}>
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
                <TabsTrigger value="ISO 27001" className="data-[state=active]:bg-white/20">ISO 27001</TabsTrigger>
                <TabsTrigger value="SOC 2" className="data-[state=active]:bg-white/20">SOC 2</TabsTrigger>
                <TabsTrigger value="ISO 42001" className="data-[state=active]:bg-white/20">ISO 42001</TabsTrigger>
                <TabsTrigger value="GDPR" className="data-[state=active]:bg-white/20">GDPR</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            {filteredEvidence.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-white">{item.control_name}</h4>
                      <Badge variant="outline" className={getStatusColor(item.status)}>
                        {item.status.replace(/_/g, ' ')}
                      </Badge>
                      <Badge variant="outline" className="bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30 text-xs">
                        {item.evidence_type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mb-2">
                      {item.standard_id} • Control: {item.control_id}
                    </p>
                    <p className="text-sm text-white/60 mb-2">{item.evidence_description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>Collected: {format(new Date(item.collection_date || item.created_date), 'MMM d, yyyy')}</span>
                      {item.validity_period_days && (
                        <>
                          <span>•</span>
                          <span>Valid for: {item.validity_period_days} days</span>
                        </>
                      )}
                      {item.reviewed_by && (
                        <>
                          <span>•</span>
                          <span>Reviewed by: {item.reviewed_by}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-[#00d4ff] hover:text-[#00aacc] hover:bg-white/10"
                  >
                    View Evidence
                  </Button>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 mb-1 font-semibold">EVIDENCE LOCATION</p>
                  <p className="text-sm text-white/80 font-mono">{item.evidence_location}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredEvidence.length === 0 && (
            <div className="text-center py-12">
              <FileCheck className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No evidence found for selected standard</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}