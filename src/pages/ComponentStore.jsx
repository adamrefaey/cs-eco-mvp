import React from "react";
import { Package, Download, Star, TrendingUp, BarChart, PieChart as PieChartIcon } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ComponentStore() {
  const components = [
    {
      id: "comp-001",
      name: "AI Insight Card",
      description: "Display AI suggestions with confidence, data sources, and ISO references",
      category: "AI",
      downloads: 47,
      rating: 4.8,
      tags: ["AI", "explainability", "ISO 42001"]
    },
    {
      id: "comp-002",
      name: "Trust Graph Overlay",
      description: "Visualize trust relationships between system components",
      category: "Visualization",
      downloads: 32,
      rating: 4.6,
      tags: ["trust", "visualization", "zero-trust"]
    },
    {
      id: "comp-003",
      name: "Audit Trail Timeline",
      description: "Scrollable timeline showing chain-of-events for decisions",
      category: "Compliance",
      downloads: 28,
      rating: 4.9,
      tags: ["audit", "compliance", "ISO 27001"]
    },
    {
      id: "comp-004",
      name: "Metric Gauge",
      description: "Animated gauge for KPI visualization with thresholds",
      category: "Visualization",
      downloads: 54,
      rating: 4.7,
      tags: ["metrics", "visualization", "dashboard"]
    }
  ];

  const stats = {
    totalComponents: components.length,
    totalDownloads: components.reduce((sum, c) => sum + c.downloads, 0),
    avgRating: components.reduce((sum, c) => sum + c.rating, 0) / components.length,
    categories: [...new Set(components.map(c => c.category))].length
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Component Store</h1>
        <p className="text-white/60">Drag-and-drop prebuilt components for custom dashboards • Modular, Reusable, ISO-Aligned</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Components"
          value={stats.totalComponents}
          icon={Package}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Total Downloads"
          value={stats.totalDownloads}
          icon={Download}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="Avg Rating"
          value={stats.avgRating.toFixed(1)}
          icon={Star}
          gradient="from-[#ffd700] to-[#ffaa00]"
        />
        <MetricCard
          title="Categories"
          value={stats.categories}
          icon={TrendingUp}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Available Components</h3>
            <Input
              placeholder="Search components..."
              className="w-64 bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {components.map((component) => (
              <div key={component.id} className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{component.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
                        <span className="text-sm text-white/70">{component.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/60 mb-3">{component.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 text-xs">
                        {component.category}
                      </Badge>
                      <span className="text-xs text-white/60">{component.downloads} downloads</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {component.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="bg-white/10 border-white/20 text-white/70 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90">
                  <Download className="w-4 h-4 mr-2" />
                  Add to Dashboard
                </Button>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}