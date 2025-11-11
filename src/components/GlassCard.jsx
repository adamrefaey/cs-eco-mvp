import React from "react";
import { Card } from "@/components/ui/card";

export default function GlassCard({ children, className = "", hover = false }) {
  return (
    <Card 
      className={`
        bg-white/8 backdrop-blur-xl border border-white/15 
        shadow-xl shadow-black/20
        ${hover ? 'hover:bg-white/10 hover:border-white/25 hover:shadow-2xl hover:shadow-[#00d4ff]/10 transition-all duration-300 hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </Card>
  );
}