import React from "react";
import { Download, Folder, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComponentStructureExport() {
  const componentTree = `# Lumanagi Frontend Structure

## 📁 Project Structure

\`\`\`
lumanagi-frontend/
├── public/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── globals.css
│   ├── components/
│   │   ├── ui/                    # Radix UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── slider.tsx
│   │   │   └── switch.tsx
│   │   ├── layout/
│   │   │   ├── Layout.tsx         # Main app layout
│   │   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   │   ├── Header.tsx         # Top header
│   │   │   └── Footer.tsx
│   │   ├── shared/                # Reusable components
│   │   │   ├── GlassCard.tsx      # Glassmorphic card
│   │   │   ├── MetricCard.tsx     # Metric display card
│   │   │   ├── StatusBadge.tsx    # Status indicator
│   │   │   ├── AIInsightCard.tsx  # AI suggestion card
│   │   │   ├── CommandModal.tsx   # Cmd+K command palette
│   │   │   ├── ActionMenu.tsx     # Dropdown action menu
│   │   │   └── PolicyRuleCard.tsx # Policy display card
│   │   ├── features/              # Feature-specific components
│   │   │   ├── contracts/
│   │   │   │   ├── ContractList.tsx
│   │   │   │   ├── ContractDetail.tsx
│   │   │   │   └── ContractMetrics.tsx
│   │   │   ├── oracles/
│   │   │   │   ├── OracleList.tsx
│   │   │   │   ├── OracleFeedCard.tsx
│   │   │   │   └── PriceChart.tsx
│   │   │   ├── agents/
│   │   │   │   ├── AgentList.tsx
│   │   │   │   ├── AgentCard.tsx
│   │   │   │   └── DecisionLog.tsx
│   │   │   ├── compliance/
│   │   │   │   ├── ComplianceGrid.tsx
│   │   │   │   └── ComplianceCard.tsx
│   │   │   └── security/
│   │   │       ├── IncidentList.tsx
│   │   │       └── SecurityControls.tsx
│   │   └── charts/                # Chart components
│   │       ├── LineChart.tsx
│   │       ├── AreaChart.tsx
│   │       ├── BarChart.tsx
│   │       └── PieChart.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── NeuralIntelligence.tsx
│   │   ├── ExplainabilityCenter.tsx
│   │   ├── Policies.tsx
│   │   ├── Contracts.tsx
│   │   ├── Oracles.tsx
│   │   ├── Markets.tsx
│   │   ├── TokenAnalytics.tsx
│   │   ├── Compliance.tsx
│   │   ├── SecurityPosture.tsx
│   │   ├── Alerts.tsx
│   │   ├── AuditLogs.tsx
│   │   ├── RiskManagement.tsx
│   │   ├── AIGovernance.tsx
│   │   ├── TreasuryOps.tsx
│   │   ├── UserSettings.tsx
│   │   └── ... (35+ more pages)
│   ├── stores/                    # Zustand state management
│   │   ├── authStore.ts
│   │   ├── contractStore.ts
│   │   ├── oracleStore.ts
│   │   ├── alertStore.ts
│   │   ├── agentStore.ts
│   │   └── uiStore.ts
│   ├── hooks/                     # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useContracts.ts
│   │   ├── useOracles.ts
│   │   ├── useAgents.ts
│   │   └── useQuery.ts
│   ├── services/                  # API services
│   │   ├── api.ts                 # Base API client
│   │   ├── authService.ts
│   │   ├── contractService.ts
│   │   ├── oracleService.ts
│   │   ├── agentService.ts
│   │   └── complianceService.ts
│   ├── types/                     # TypeScript types
│   │   ├── index.ts
│   │   ├── entities.ts
│   │   ├── auth.ts
│   │   └── api.ts
│   ├── utils/                     # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
\`\`\`

---

## 🧩 Key Component Examples

### GlassCard.tsx

\`\`\`typescript
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/8 backdrop-blur-xl border border-white/15",
        "shadow-xl shadow-black/20 rounded-2xl",
        hover && "hover:bg-white/10 hover:border-white/25 hover:shadow-2xl transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
\`\`\`

### MetricCard.tsx

\`\`\`typescript
import React from "react";
import { GlassCard } from "./GlassCard";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { FC } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: FC<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: string;
  suffix?: string;
  gradient?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  suffix = "",
  gradient = "from-[#00d4ff] to-[#b388ff]"
}: MetricCardProps) {
  return (
    <GlassCard hover>
      <div className="relative overflow-hidden">
        <div className={\`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br \${gradient} opacity-10 blur-3xl\`} />
        <div className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div className={\`p-3 rounded-xl bg-gradient-to-br \${gradient} bg-opacity-20\`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {trendValue && (
              <div className="flex items-center gap-1 text-sm font-medium">
                {trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-[#39ff14]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                {trendValue}
              </div>
            )}
          </div>
          <p className="text-white/60 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">
            {value}
            {suffix && <span className="text-lg text-white/60 ml-1">{suffix}</span>}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
\`\`\`

### StatusBadge.tsx

\`\`\`typescript
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type Status = "healthy" | "warning" | "critical" | "active" | "paused";

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    color: "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30",
    label: "Healthy"
  },
  active: {
    icon: CheckCircle2,
    color: "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30",
    label: "Active"
  },
  warning: {
    icon: AlertTriangle,
    color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    label: "Warning"
  },
  critical: {
    icon: XCircle,
    color: "bg-red-500/20 text-red-300 border-red-500/30",
    label: "Critical"
  },
  paused: {
    icon: XCircle,
    color: "bg-white/20 text-white/70 border-white/30",
    label: "Paused"
  }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={\`\${config.color} border backdrop-blur-sm flex items-center gap-1\`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
\`\`\`

### AIInsightCard.tsx

\`\`\`typescript
import React from "react";
import { Brain, ThumbsUp, ThumbsDown, Info } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AIInsightCardProps {
  title: string;
  description: string;
  confidence: number;
  action?: string;
  onAccept?: () => void;
  onReject?: () => void;
  explainability?: string;
}

export function AIInsightCard({
  title,
  description,
  confidence,
  action,
  onAccept,
  onReject,
  explainability
}: AIInsightCardProps) {
  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">{title}</h3>
              <Badge className="mt-1 bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30">
                {confidence}% confidence
              </Badge>
            </div>
          </div>
          {explainability && (
            <button className="text-white/60 hover:text-white transition-colors">
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className="text-white/70 mb-4">{description}</p>

        {action && (
          <div className="bg-white/5 rounded-lg p-3 mb-4">
            <p className="text-sm text-white/60 mb-1">Suggested Action:</p>
            <p className="text-white font-medium">{action}</p>
          </div>
        )}

        <div className="flex gap-2">
          {onAccept && (
            <Button onClick={onAccept} size="sm" className="bg-[#39ff14] hover:bg-[#2ecc11] text-black">
              <ThumbsUp className="w-4 h-4 mr-2" />
              Accept
            </Button>
          )}
          {onReject && (
            <Button onClick={onReject} size="sm" variant="outline" className="border-white/20 text-white">
              <ThumbsDown className="w-4 h-4 mr-2" />
              Reject
            </Button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
\`\`\`

---

## 🎨 Tailwind Configuration

\`\`\`typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lumanagi: {
          bg: "#0F111A",
          surface: "#1A1C27",
          blue: "#3B82F6",
          purple: "#8B5CF6",
          green: "#39ff14",
          cyan: "#00d4ff"
        }
      },
      backdropBlur: {
        xs: "2px"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
\`\`\`

---

## 📦 Package.json Scripts

\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
\`\`\`

---

## 🔄 Icon Usage Pattern

When using Lucide React icons, import them directly and use as React components:

\`\`\`typescript
import { Brain, Shield, Activity } from "lucide-react";

// In your component
<Brain className="w-6 h-6 text-white" />
<Shield className="w-5 h-5 text-[#39ff14]" />
<Activity className="w-4 h-4 text-[#3B82F6]" />
\`\`\`

For TypeScript props that accept icons, use:
\`\`\`typescript
import type { FC } from "react";

interface Props {
  icon: FC<{ className?: string }>;
}
\`\`\`

---

## 📱 Responsive Design Patterns

\`\`\`typescript
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Conditional rendering for mobile
<div className="hidden md:block">
  {/* Desktop-only content */}
</div>

<div className="md:hidden">
  {/* Mobile-only content */}
</div>
\`\`\``;

  const handleDownload = () => {
    const blob = new Blob([componentTree], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lumanagi-component-structure.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Component Structure Export</h1>
          <p className="text-white/60">Complete frontend architecture and component hierarchy</p>
        </div>
        <Button onClick={handleDownload} className="bg-[#00d4ff] hover:bg-[#0099cc]">
          <Download className="w-4 h-4 mr-2" />
          Download Structure
        </Button>
      </div>

      <div className="bg-[#0F111A] rounded-xl border border-white/10 p-6 max-h-[600px] overflow-y-auto">
        <pre className="text-sm text-white/80 whitespace-pre-wrap">
          {componentTree}
        </pre>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Folder className="w-5 h-5 text-[#3B82F6]" />
            <h3 className="text-white font-bold">Pages</h3>
          </div>
          <p className="text-4xl font-bold text-[#3B82F6]">35+</p>
          <p className="text-sm text-white/60 mt-2">Route components</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="w-5 h-5 text-[#8B5CF6]" />
            <h3 className="text-white font-bold">Components</h3>
          </div>
          <p className="text-4xl font-bold text-[#8B5CF6]">50+</p>
          <p className="text-sm text-white/60 mt-2">Reusable UI components</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="w-5 h-5 text-[#39ff14]" />
            <h3 className="text-white font-bold">Stores</h3>
          </div>
          <p className="text-4xl font-bold text-[#39ff14]">10+</p>
          <p className="text-sm text-white/60 mt-2">Zustand state stores</p>
        </div>
        <div className="bg-[#1A1C27] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="w-5 h-5 text-[#00d4ff]" />
            <h3 className="text-white font-bold">Hooks</h3>
          </div>
          <p className="text-4xl font-bold text-[#00d4ff]">15+</p>
          <p className="text-sm text-white/60 mt-2">Custom React hooks</p>
        </div>
      </div>
    </div>
  );
}