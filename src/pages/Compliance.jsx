import React, { useState, useEffect } from "react";
import { ComplianceMetric } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Shield, Award, FileCheck, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Compliance() {
  const [metrics, setMetrics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    const data = await ComplianceMetric.list("-created_date");
    setMetrics(data);
  };

  const filteredMetrics = selectedCategory === "all" 
    ? metrics 
    : metrics.filter(m => m.category === selectedCategory);

  const overallCompliance = metrics.length > 0 
    ? metrics.reduce((sum, m) => sum + m.compliance_score, 0) / metrics.length 
    : 0;

  const certified = metrics.filter(m => m.certification_status === "certified").length;
  const inProgress = metrics.filter(m => m.status === "in_progress").length;
  const nonCompliant = metrics.filter(m => m.status === "non_compliant").length;

  const getCategoryColor = (category) => {
    const colors = {
      security: "from-[#00d4ff] to-[#0099cc]",
      privacy: "from-[#b388ff] to-[#8e6bcc]",
      quality: "from-[#39ff14] to-[#2ecc11]",
      ai_governance: "from-[#ff6b9d] to-[#cc5678]",
      data_governance: "from-[#ffd700] to-[#ffaa00]",
      business_continuity: "from-[#ff8c00] to-[#cc6f00]"
    };
    return colors[category] || colors.security;
  };

  const getStatusBadge = (status) => {
    const configs = {
      compliant: { color: "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30", label: "Compliant" },
      certified: { color: "bg-[#00d4ff]/20 text-[#00d4ff] border-[#00d4ff]/30", label: "Certified" },
      partial: { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", label: "Partial" },
      non_compliant: { color: "bg-red-500/20 text-red-300 border-red-500/30", label: "Non-Compliant" },
      in_progress: { color: "bg-[#b388ff]/20 text-[#b388ff] border-[#b388ff]/30", label: "In Progress" }
    };
    const config = configs[status] || configs.partial;
    return <Badge variant="outline" className={`${config.color} border backdrop-blur-sm`}>{config.label}</Badge>;
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">ISO Compliance Dashboard</h1>
          <p className="text-white/60">Global standards adherence and certification status</p>
          <div className="flex items-center gap-2 mt-3">
            <Shield className="w-5 h-5 text-[#00d4ff]" />
            <span className="text-white/80 text-sm font-medium">Zero-Trust Security Model</span>
            <span className="text-white/40">•</span>
            <Award className="w-5 h-5 text-[#39ff14]" />
            <span className="text-white/80 text-sm font-medium">ISO/IEC 27001 Aligned</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#39ff14]">
            {overallCompliance.toFixed(0)}%
          </div>
          <p className="text-white/60 text-sm mt-1">Overall Compliance Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Certified Standards"
          value={certified}
          icon={Award}
          trend="up"
          trendValue={`${metrics.length} total`}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
        <MetricCard
          title="In Progress"
          value={inProgress}
          icon={Clock}
          gradient="from-[#b388ff] to-[#8e6bcc]"
        />
        <MetricCard
          title="Non-Compliant"
          value={nonCompliant}
          icon={AlertTriangle}
          gradient="from-[#ff6b9d] to-[#cc5678]"
        />
        <MetricCard
          title="Avg Compliance"
          value={`${overallCompliance.toFixed(1)}%`}
          icon={TrendingUp}
          trend="up"
          trendValue="+5.2%"
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-white/10 border border-white/20 mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-white/20">All</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white/20">Security</TabsTrigger>
          <TabsTrigger value="privacy" className="data-[state=active]:bg-white/20">Privacy</TabsTrigger>
          <TabsTrigger value="quality" className="data-[state=active]:bg-white/20">Quality</TabsTrigger>
          <TabsTrigger value="ai_governance" className="data-[state=active]:bg-white/20">AI</TabsTrigger>
          <TabsTrigger value="data_governance" className="data-[state=active]:bg-white/20">Data</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6">
        {filteredMetrics.map((metric) => (
          <GlassCard key={metric.id}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(metric.category)} rounded-xl flex items-center justify-center`}>
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{metric.standard_name}</h3>
                      <p className="text-white/60 text-sm">Standard ID: {metric.standard_id}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-white/70 text-xs uppercase">
                    {metric.category.replace(/_/g, ' ')}
                  </Badge>
                </div>
                {getStatusBadge(metric.status)}
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-white/60 text-sm mb-2">Compliance Score</p>
                  <div className="flex items-center gap-3">
                    <Progress value={metric.compliance_score} className="flex-1 h-3" />
                    <span className="text-2xl font-bold text-white">{metric.compliance_score}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-2">Remediation Progress</p>
                  <div className="flex items-center gap-3">
                    <Progress value={metric.remediation_progress || 0} className="flex-1 h-3" />
                    <span className="text-2xl font-bold text-white">{metric.remediation_progress || 0}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-2">Findings</p>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${metric.findings_count > 5 ? 'text-red-400' : 'text-yellow-400'}`} />
                    <span className="text-2xl font-bold text-white">{metric.findings_count || 0}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-xs mb-1">Last Audit</p>
                  <p className="text-white font-medium">
                    {metric.last_audit_date ? format(new Date(metric.last_audit_date), 'MMM d, yyyy') : 'Not audited'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-xs mb-1">Next Audit</p>
                  <p className="text-white font-medium">
                    {metric.next_audit_date ? format(new Date(metric.next_audit_date), 'MMM d, yyyy') : 'Not scheduled'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-xs mb-1">Certification</p>
                  <Badge variant="outline" className={
                    metric.certification_status === 'certified' 
                      ? 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30'
                      : 'bg-white/10 border-white/20 text-white/70'
                  }>
                    {metric.certification_status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {filteredMetrics.length === 0 && (
        <div className="text-center py-16">
          <FileCheck className="w-20 h-20 text-white/20 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No compliance metrics found</p>
        </div>
      )}
    </div>
  );
}