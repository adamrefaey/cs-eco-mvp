import React from "react";
import { Key, Shield, Users, Lock, CheckCircle2, XCircle, Activity } from "lucide-react";
import GlassCard from "../components/GlassCard";
import MetricCard from "../components/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AccessControl() {
  const roles = [
    { name: "Admin", users: 3, permissions: 45, color: "from-red-500 to-red-700" },
    { name: "Operator", users: 7, permissions: 28, color: "from-[#3B82F6] to-[#6366F1]" },
    { name: "Compliance Officer", users: 2, permissions: 15, color: "from-[#8B5CF6] to-[#A855F7]" },
    { name: "Viewer", users: 24, permissions: 5, color: "from-[#00d4ff] to-[#0099cc]" }
  ];

  const sessions = [
    { user: "admin@lumanagi.xyz", role: "Admin", mfa: true, ip: "192.168.1.100", location: "United States", active: true },
    { user: "operator1@lumanagi.xyz", role: "Operator", mfa: true, ip: "10.0.0.45", location: "Germany", active: true },
    { user: "compliance@lumanagi.xyz", role: "Compliance Officer", mfa: true, ip: "172.16.0.22", location: "United Kingdom", active: true },
    { user: "viewer@lumanagi.xyz", role: "Viewer", mfa: false, ip: "192.168.1.150", location: "United States", active: false }
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Access Control</h1>
        <p className="text-white/60">RBAC, session management, and MFA enforcement • ISO 27001 A.9, NIST 800-53</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={roles.reduce((sum, r) => sum + r.users, 0)}
          icon={Users}
          gradient="from-[#3B82F6] to-[#6366F1]"
        />
        <MetricCard
          title="Active Sessions"
          value={sessions.filter(s => s.active).length}
          icon={Activity}
          gradient="from-[#39ff14] to-[#2ecc11]"
        />
        <MetricCard
          title="MFA Enabled"
          value={`${((sessions.filter(s => s.mfa).length / sessions.length) * 100).toFixed(0)}%`}
          icon={Shield}
          gradient="from-[#8B5CF6] to-[#A855F7]"
        />
        <MetricCard
          title="Role Types"
          value={roles.length}
          icon={Key}
          gradient="from-[#00d4ff] to-[#0099cc]"
        />
      </div>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Role Distribution</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((role, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center`}>
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{role.name}</h4>
                    <p className="text-sm text-white/60">{role.users} users</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/60">Permissions</span>
                    <span className="text-sm font-semibold text-white">{role.permissions}</span>
                  </div>
                  <Progress value={(role.permissions / 45) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Active Sessions</h3>
          <div className="space-y-3">
            {sessions.map((session, idx) => (
              <div key={idx} className="p-5 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      session.active ? 'bg-[#39ff14]/20' : 'bg-white/10'
                    }`}>
                      <Users className={`w-5 h-5 ${session.active ? 'text-[#39ff14]' : 'text-white/50'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-white">{session.user}</p>
                        <Badge variant="outline" className="bg-white/10 border-white/20 text-white/70">
                          {session.role}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/60">
                        <span>{session.ip}</span>
                        <span>•</span>
                        <span>{session.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {session.mfa ? (
                      <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        MFA
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        No MFA
                      </Badge>
                    )}
                    <Badge variant="outline" className={session.active 
                      ? 'bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30'
                      : 'bg-white/10 border-white/20 text-white/60'
                    }>
                      {session.active ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
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