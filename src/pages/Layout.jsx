
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { auth } from "@/api/auth";
import {
  LayoutDashboard,
  FileCode2,
  Coins,
  TrendingUp,
  Radio,
  FileText,
  Bell,
  LogOut,
  Shield,
  Activity,
  Lock,
  Eye,
  ChevronRight,
  ChevronDown,
  Zap,
  Brain,
  Scale,
  Database,
  Workflow,
  Settings,
  UserCheck,
  FileCheck,
  Target,
  Lightbulb,
  GitBranch,
  Download,
  Users,
  Calendar,
  Key,
  Server,
  Sliders,
  Clock,
  Search,
  MessageSquare,
  Menu,
  X,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import PRISMTrigger from "../components/PRISMTrigger";

const navigationCategories = [
  {
    label: "MISSION CONTROL",
    id: "mission-control",
    items: [
      {
        title: "Dashboard",
        url: createPageUrl("Dashboard"),
        icon: LayoutDashboard,
        iso: "ISO 25010",
        description: "Overview of metrics and system health"
      },
      {
        title: "Neural Insights",
        url: createPageUrl("NeuralIntelligence"),
        icon: Brain,
        iso: "ISO 42001",
        description: "AI-suggested actions",
        aiPowered: true
      },
      {
        title: "Explainability Center",
        url: createPageUrl("ExplainabilityCenter"),
        icon: Lightbulb,
        iso: "ISO 22989",
        description: "Transparent AI reasoning"
      },
      {
        title: "Policy Engine",
        url: createPageUrl("Policies"),
        icon: FileCheck,
        iso: "ISO 38505-1",
        description: "Governance rules and policies"
      }
    ]
  },
  {
    label: "OPERATIONS",
    id: "operations",
    items: [
      {
        title: "Smart Contracts",
        url: createPageUrl("Contracts"),
        icon: FileCode2,
        iso: "ISO 27034",
        description: "Contract health monitoring",
        roles: ['admin', 'operator']
      },
      {
        title: "Oracle Feeds",
        url: createPageUrl("Oracles"),
        icon: Radio,
        iso: "ISO 27001",
        description: "Data feed integrity",
        liveStatus: "active"
      },
      {
        title: "Markets",
        url: createPageUrl("Markets"),
        icon: TrendingUp,
        iso: "ISO 25010",
        description: "Prediction markets"
      },
      {
        title: "Schedulers",
        url: createPageUrl("Schedulers"),
        icon: Calendar,
        iso: "ISO 20000-1",
        description: "Automated jobs",
        roles: ['admin', 'operator']
      },
      {
        title: "Treasury Ops",
        url: createPageUrl("TreasuryOps"),
        icon: Coins,
        iso: "ISO 38505-1",
        description: "Token flow management",
        roles: ['admin', 'operator']
      }
    ]
  },
  {
    label: "ANALYTICS",
    id: "analytics",
    items: [
      {
        title: "Token Analytics",
        url: createPageUrl("TokenAnalytics"),
        icon: Coins,
        iso: "ISO 25012",
        description: "LMNG token metrics"
      },
      {
        title: "Deviation Monitor",
        url: createPageUrl("DeviationMonitor"),
        icon: Activity,
        iso: "ISO 27005",
        description: "Anomaly detection"
      },
      {
        title: "AI Actions Log",
        url: createPageUrl("AIActionsLog"),
        icon: GitBranch,
        iso: "ISO 42001",
        description: "Agent decision history",
        aiPowered: true
      },
      {
        title: "Prediction Risk Map",
        url: createPageUrl("PredictionRiskMap"),
        icon: Target,
        iso: "ISO 31000",
        description: "Risk assessment"
      }
    ]
  },
  {
    label: "SECURITY & COMPLIANCE",
    id: "security",
    items: [
      {
        title: "Compliance",
        url: createPageUrl("Compliance"),
        icon: Shield,
        iso: "ISO 27001",
        description: "ISO certification status",
        liveStatus: "protected"
      },
      {
        title: "Security Posture",
        url: createPageUrl("SecurityPosture"),
        icon: Eye,
        iso: "ISO 27002",
        description: "Security controls"
      },
      {
        title: "Alerts",
        url: createPageUrl("Alerts"),
        icon: Bell,
        iso: "ISO 27035",
        description: "Active system alerts",
        badge: 3
      },
      {
        title: "Audit Logs",
        url: createPageUrl("AuditLogs"),
        icon: FileText,
        iso: "ISO 27001",
        description: "Full action trail"
      },
      {
        title: "Access Control",
        url: createPageUrl("AccessControl"),
        icon: Key,
        iso: "ISO 27001 A.9",
        description: "RBAC management",
        roles: ['admin']
      },
      {
        title: "Data Vault",
        url: createPageUrl("DataVault"),
        icon: Lock,
        iso: "ISO 27701",
        description: "Encrypted storage"
      },
      {
        title: "Trust Boundaries",
        url: createPageUrl("TrustBoundaries"),
        icon: Shield,
        iso: "NIST 800-207",
        description: "Zero-trust controls"
      }
    ]
  },
  {
    label: "GOVERNANCE",
    id: "governance",
    items: [
      {
        title: "Risk Management",
        url: createPageUrl("RiskManagement"),
        icon: Target,
        iso: "ISO 31000",
        description: "Risk assessment"
      },
      {
        title: "Data Governance",
        url: createPageUrl("DataGovernance"),
        icon: Database,
        iso: "ISO 38505",
        description: "Data quality controls"
      },
      {
        title: "AI Governance",
        url: createPageUrl("AIGovernance"),
        icon: Brain,
        iso: "ISO 42001",
        description: "AI system oversight",
        aiPowered: true
      },
      {
        title: "Identity Graph",
        url: createPageUrl("IdentityGraph"),
        icon: Users,
        iso: "ISO 24760",
        description: "Entity relationships"
      },
      {
        title: "Certify",
        url: createPageUrl("Certify"),
        icon: FileCheck,
        iso: "SOC 2 Type II",
        description: "Certification manager"
      }
    ]
  },
  {
    label: "INTELLIGENT SYSTEMS",
    id: "intelligent",
    items: [
      {
        title: "Temporal Reasoning",
        url: createPageUrl("TemporalReasoning"),
        icon: Clock,
        iso: "ISO 25023",
        description: "Time-series intelligence"
      },
      {
        title: "Scenario Simulator",
        url: createPageUrl("ScenarioSimulator"),
        icon: Zap,
        iso: "ISO 22301",
        description: "What-if testing"
      },
      {
        title: "Feedback Loop",
        url: createPageUrl("FeedbackLoop"),
        icon: Brain,
        iso: "ISO 42001",
        description: "AI learning system",
        aiPowered: true
      },
      {
        title: "Automation Engine",
        url: createPageUrl("AutomationEngine"),
        icon: Workflow,
        iso: "ISO 27001",
        description: "Policy automation"
      }
    ]
  },
  {
    label: "SYSTEM",
    id: "system",
    items: [
      {
        title: "System Status",
        url: createPageUrl("SystemStatus"),
        icon: Server,
        iso: "ISO 27001",
        description: "Infrastructure health",
        liveStatus: "online"
      },
      {
        title: "Agent Controls",
        url: createPageUrl("AgentControls"),
        icon: Sliders,
        iso: "ISO 22989",
        description: "AI agent configuration",
        roles: ['admin']
      }
    ]
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState({});

  React.useEffect(() => {
    loadUser();
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      try {
        setCollapsedGroups(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse sidebar state", e);
      }
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always redirect to login page after logout attempt
      navigate('/login');
    }
  };

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => {
      const newState = { ...prev, [groupId]: !prev[groupId] };
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
      return newState;
    });
  };

  const hasAccess = (item) => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user?.role);
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { color: 'bg-[#39ff14]', label: 'ACTIVE', dotColor: '#39ff14' };
      case 'protected':
        return { color: 'bg-[#3B82F6]', label: 'PROTECTED', dotColor: '#3B82F6' };
      case 'online':
        return { color: 'bg-[#39ff14]', label: 'ONLINE', dotColor: '#39ff14' };
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --sidebar-bg: #0F111A;
          --sidebar-surface: #1A1C27;
          --sidebar-border: rgba(255, 255, 255, 0.08);
          --text-primary: #E5E7EB;
          --text-secondary: #9CA3AF;
          --text-muted: #6B7280;
          --accent-blue: #3B82F6;
          --accent-purple: #8B5CF6;
          --accent-green: #39ff14;
        }

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        [data-sidebar="sidebar"],
        .sidebar-enhanced,
        [data-sidebar] {
          background: #0F111A !important;
          border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        [data-sidebar] * {
          background-color: transparent;
        }

        [data-sidebar="header"],
        [data-sidebar="footer"],
        [data-sidebar="content"] {
          background: #0F111A !important;
        }

        .sidebar-enhanced {
          background: var(--sidebar-bg) !important;
          border-right: 1px solid var(--sidebar-border);
        }

        .nav-item-enhanced {
          position: relative;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 3px solid transparent;
          color: var(--text-secondary);
          margin: 2px 8px;
          border-radius: 0.75rem;
          background: transparent !important;
        }

        .nav-item-enhanced:hover {
          background: rgba(59, 130, 246, 0.08) !important;
          border-left-color: var(--accent-blue);
          color: var(--text-primary);
          transform: translateX(2px);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.15);
        }

        .nav-item-active {
          background: rgba(59, 130, 246, 0.12) !important;
          border-left-color: var(--accent-blue);
          color: var(--text-primary);
          font-weight: 600;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.2);
        }

        .nav-item-active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 70%;
          background: linear-gradient(to bottom, transparent, var(--accent-blue), transparent);
        }

        .group-header {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.2px;
          color: var(--text-muted);
          text-transform: uppercase;
          padding: 12px 16px 8px;
          transition: color 0.2s;
          background: transparent !important;
        }

        .group-header:hover {
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.03) !important;
        }

        .iso-badge {
          font-size: 9px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(99, 102, 241, 0.12) !important;
          color: #A5B4FC;
          border: 1px solid rgba(99, 102, 241, 0.25);
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        .ai-powered-badge {
          background: linear-gradient(135deg, #8B5CF6, #EC4899) !important;
          color: white;
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 15px rgba(139, 92, 246, 0.8);
          }
        }

        .notification-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #EF4444 !important;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }

        .tooltip-hint {
          position: absolute;
          left: 100%;
          margin-left: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: #1A1C27 !important;
          color: var(--text-primary);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          border: 1px solid var(--sidebar-border);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .nav-item-enhanced:hover .tooltip-hint {
          opacity: 1;
        }

        .system-status-card {
          background: linear-gradient(135deg, #1A1C27 0%, #0F111A 100%) !important;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          margin: 12px;
        }

        .collapse-icon {
          transition: transform 0.2s;
        }

        .collapse-icon.collapsed {
          transform: rotate(-90deg);
        }

        .new-badge {
          background: linear-gradient(135deg, #3B82F6, #6366F1) !important;
          color: white;
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .zero-trust-badge {
          background: linear-gradient(135deg, #581C87, #831843) !important;
          border: 1px solid #7C2D92;
        }
      `}</style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0a0118] via-[#0f0520] to-[#1a0b2e]">
        <Sidebar className="sidebar-enhanced" style={{ width: '280px', background: '#0F111A' }}>
          <SidebarHeader className="border-b border-white/10 px-5 py-6" style={{ background: '#0F111A' }}>
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg shadow-[#3B82F6]/40"
              >
                <Shield className="w-7 h-7 text-white" strokeWidth={2.5} />
              </motion.div>
              <div>
                <h2 className="font-bold text-white text-lg tracking-tight">Lumanagi</h2>
                <p className="text-[10px] text-[#9CA3AF] font-medium uppercase tracking-wider">Intelligence Agent</p>
              </div>
            </div>
            
            <div className="system-status-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#9CA3AF] font-semibold tracking-wider uppercase">Agent Status</span>
                <div className="flex items-center gap-1.5">
                  <div className="status-indicator bg-[#39ff14]" />
                  <span className="text-[10px] text-[#39ff14] font-bold tracking-wide">ONLINE</span>
                </div>
              </div>
              <p className="text-[11px] text-[#E5E7EB] leading-relaxed">Neural Core Active</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#3B82F6] to-[#39ff14]"
                    initial={{ width: "0%" }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[10px] text-[#39ff14] font-bold">94%</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-2 py-4" style={{ background: '#0F111A' }}>
            {navigationCategories.map((category, idx) => (
              <SidebarGroup key={idx} className="mb-4">
                <button
                  onClick={() => toggleGroup(category.id)}
                  className="group-header w-full flex items-center justify-between cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span>{category.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 collapse-icon ${collapsedGroups[category.id] ? 'collapsed' : ''}`} />
                </button>
                <AnimatePresence>
                  {!collapsedGroups[category.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                          {category.items.filter(item => hasAccess(item)).map((item) => {
                            const isActive = location.pathname === item.url;
                            const statusConfig = item.liveStatus ? getStatusConfig(item.liveStatus) : null;
                            
                            return (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                  asChild
                                  className={`nav-item-enhanced relative ${isActive ? 'nav-item-active' : ''}`}
                                >
                                  <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5 rounded-xl relative">
                                    <item.icon 
                                      className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-[#3B82F6]' : 'text-[#9CA3AF]'}`} 
                                      strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    <span className="text-[13px] flex-1">
                                      {item.title}
                                    </span>
                                    
                                    {item.aiPowered && (
                                      <div className="ai-powered-badge flex items-center gap-1">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        AI
                                      </div>
                                    )}
                                    
                                    {item.badge && (
                                      <div className="notification-badge">
                                        {item.badge}
                                      </div>
                                    )}
                                    
                                    {statusConfig && (
                                      <div className="flex items-center gap-1">
                                        <div className={`status-indicator ${statusConfig.color}`} />
                                      </div>
                                    )}
                                    
                                    {isActive && (
                                      <ChevronRight className="w-4 h-4 text-[#3B82F6]" strokeWidth={3} />
                                    )}
                                    
                                    <div className="tooltip-hint">
                                      <div className="font-semibold mb-0.5">{item.title}</div>
                                      <div className="text-[#9CA3AF] text-[10px]">{item.description}</div>
                                      {item.iso && (
                                        <div className="iso-badge mt-1 inline-block">{item.iso}</div>
                                      )}
                                    </div>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          })}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SidebarGroup>
            ))}

            <SidebarGroup className="mt-auto pt-4">
              <div className="system-status-card">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-[#3B82F6]" strokeWidth={2.5} />
                  <span className="group-header p-0">LIVE STATUS</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Polygon RPC", status: "online", color: "bg-[#39ff14]" },
                    { label: "Oracle Network", status: "active", color: "bg-[#3B82F6]" },
                    { label: "Security", status: "protected", color: "bg-[#8B5CF6]" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <span className="text-[#E5E7EB] font-medium">{item.label}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`status-indicator ${item.color}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: item.color.replace('bg-', '') }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SidebarGroup>

            <SidebarGroup className="mt-3">
              <div className="system-status-card">
                <div className="group-header p-0 mb-2">COMPLIANCE</div>
                <div className="flex flex-wrap gap-1.5">
                  {['ISO 27001', 'ISO 42001', 'SOC 2', 'GDPR'].map((cert) => (
                    <span key={cert} className="iso-badge">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </SidebarGroup>

            <SidebarGroup className="mt-2">
              <div className="mx-3 px-3 py-2 rounded-lg zero-trust-badge">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#E9D5FF]" strokeWidth={2.5} />
                  <span className="text-[11px] text-[#F3E8FF] font-semibold">Zero-Trust Model</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#39ff14] ml-auto" />
                </div>
              </div>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-white/10 px-4 py-4" style={{ background: '#0F111A' }}>
            {user && (
              <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-[#1A1C27] hover:bg-[#22242F] transition-colors border border-white/8">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-9 h-9 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
                  >
                    <span className="text-white font-bold text-sm">
                      {user.full_name?.charAt(0) || 'A'}
                    </span>
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#E5E7EB] text-sm truncate">{user.full_name || 'Admin'}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-[#9CA3AF] truncate uppercase tracking-wide font-medium">{user.role}</p>
                      <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30 text-[9px] px-1 py-0">
                        ACTIVE
                      </Badge>
                    </div>
                  </div>
                </div>
                <Link to={createPageUrl("UserSettings")}>
                  <button
                    className="p-2 hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4 text-[#9CA3AF] hover:text-[#E5E7EB]" strokeWidth={2} />
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4 text-[#9CA3AF] hover:text-[#E5E7EB]" strokeWidth={2} />
                </button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-white" />
                <div>
                  <h2 className="text-xl font-bold text-white">{currentPageName}</h2>
                  <p className="text-xs text-white/60">Infrastructure Intelligence System</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                  <kbd className="ml-2 px-2 py-0.5 bg-white/10 rounded text-xs">⌘K</kbd>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Link to={createPageUrl("Notifications")}>
                    <Bell className="w-4 h-4" />
                  </Link>
                </Button>

                {user && (
                  <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                    <Link to={createPageUrl("UserSettings")}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                      >
                        <span className="text-white text-sm font-semibold">
                          {user.full_name?.charAt(0) || 'U'}
                        </span>
                      </motion.div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>

          <PRISMTrigger currentPage={currentPageName} />
        </div>
      </div>
    </SidebarProvider>
  );
}
