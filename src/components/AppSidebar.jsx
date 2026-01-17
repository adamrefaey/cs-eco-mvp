import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { auth } from "@/api/auth";
import {
  Shield,
  Activity,
  Lock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  LogOut,
  Settings
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
  SidebarFooter
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { navigationCategories } from "@/constants/navigation";

/**
 * AppSidebar Component
 *
 * Main navigation sidebar with:
 * - Collapsible navigation groups
 * - Role-based access control
 * - Live status indicators
 * - User profile and logout
 *
 * @param {Object} props
 * @param {Object} props.user - User object with role and full_name
 * @param {Function} props.onLogout - Logout handler
 */
export default function AppSidebar({ user, onLogout }) {
  const location = useLocation();
  const [collapsedGroups, setCollapsedGroups] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved) {
      try {
        setCollapsedGroups(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse sidebar state", e);
      }
    }
  }, []);

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
    <Sidebar className="sidebar-enhanced" style={{ width: '280px', background: '#0F111A' }}>
      {/* ===== HEADER ===== */}
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

      {/* ===== NAVIGATION CONTENT ===== */}
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

        {/* ===== LIVE STATUS ===== */}
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

        {/* ===== COMPLIANCE BADGES ===== */}
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

        {/* ===== ZERO TRUST INDICATOR ===== */}
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

      {/* ===== FOOTER (USER PROFILE) ===== */}
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
              onClick={onLogout}
              className="p-2 hover:bg-white/10 rounded-md transition-colors flex-shrink-0"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4 text-[#9CA3AF] hover:text-[#E5E7EB]" strokeWidth={2} />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
