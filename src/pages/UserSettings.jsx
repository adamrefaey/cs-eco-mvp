import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Shield, Palette, Bell, User as UserIcon, Smartphone, Key, Globe, Save, Camera, Monitor, Sun, Moon, LogOut, MapPin, Download, Upload, Brain, Zap, AlertTriangle } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { AdminLog } from "@/api/entities";

const DEFAULT_SETTINGS = {
  // Personalization
  theme: "dark",
  density: "standard",
  language: "en",
  timezone: "America/New_York",
  fontSize: "standard",
  highContrast: false,
  profilePicture: null,
  
  // Security
  mfaEnabled: false,
  sessionTimeout: 30,
  securityScore: 50,
  
  // Notifications
  systemStatusUpdates: true,
  policyChangeAlerts: true,
  aiDecisionNotifications: true,
  dataInsightAlerts: true,
  weeklyDigest: true,
  deliveryEmail: true,
  deliveryInApp: true,
  deliveryWebhook: false,
  
  // AI
  aiSuggestionLevel: "balanced",
  aiConfidenceThreshold: 75,
  aiResponseType: "explainable",
  aiFeedbackOptIn: true,
  showExplainability: true,
  showDataOrigin: true
};

export default function UserSettings() {
  const [user, setUser] = useState(null);
  const [originalSettings, setOriginalSettings] = useState(null);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [aiStats, setAiStats] = useState({
    totalDecisions: 0,
    overrideRate: 0,
    lastOverride: null
  });

  useEffect(() => {
    loadUser();
    loadSessions();
    loadAIStats();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      // Load user settings from user data or use defaults
      const userSettings = currentUser.settings 
        ? { ...DEFAULT_SETTINGS, ...currentUser.settings }
        : { ...DEFAULT_SETTINGS };
      
      setSettings(userSettings);
      setOriginalSettings(userSettings);
      
      // Calculate security score with loaded settings
      calculateSecurityScore(currentUser, userSettings);
    } catch (error) {
      console.log("User not authenticated", error);
    }
  };

  const loadSessions = () => {
    // Mock session data
    setSessions([
      {
        id: 1,
        device: "Chrome on MacOS",
        location: "New York, USA",
        ip: "192.168.1.100",
        lastActive: "Just now",
        current: true
      },
      {
        id: 2,
        device: "Safari on iPhone",
        location: "New York, USA",
        ip: "192.168.1.105",
        lastActive: "2 hours ago",
        current: false
      }
    ]);
  };

  const loadAIStats = async () => {
    // Mock AI stats - in real app, fetch from AgentDecisionLog
    setAiStats({
      totalDecisions: 127,
      overrideRate: 8.7,
      lastOverride: "Gas optimization suggestion - Contract batch execution"
    });
  };

  const calculateSecurityScore = (currentUser, currentSettings) => {
    let score = 50; // Base score
    
    if (currentSettings?.mfaEnabled) score += 30;
    if (currentSettings?.sessionTimeout && currentSettings.sessionTimeout <= 30) score += 10;
    if (currentUser?.role === 'admin') score += 10;
    
    const finalScore = Math.min(score, 100);
    setSettings(prev => ({ ...prev, securityScore: finalScore }));
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => {
      if (!prev) return DEFAULT_SETTINGS;
      const newSettings = { ...prev, [key]: value };
      setHasChanges(true);
      return newSettings;
    });
  };

  const handleSave = async () => {
    if (!settings) {
      alert("Settings not loaded. Please refresh the page.");
      return;
    }

    setSaving(true);
    try {
      // Save to user entity
      await User.updateMyUserData({ settings });
      
      // Log settings change
      if (originalSettings) {
        const changedSettings = Object.keys(settings).filter(
          key => settings[key] !== originalSettings[key]
        );
        
        if (changedSettings.length > 0) {
          try {
            await AdminLog.create({
              action: `Updated settings: ${changedSettings.join(', ')}`,
              endpoint: "/settings",
              status: "success",
              user_role: user?.role || 'unknown',
              details: JSON.stringify({ 
                changed: changedSettings,
                newValues: changedSettings.reduce((acc, key) => {
                  acc[key] = settings[key];
                  return acc;
                }, {})
              })
            });
          } catch (logError) {
            console.error("Failed to log settings change:", logError);
            // Don't fail the save if logging fails
          }
        }
      }
      
      setOriginalSettings({ ...settings });
      setHasChanges(false);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert(`Failed to save settings: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings({ ...originalSettings });
      setHasChanges(false);
    }
  };

  const exportSettings = () => {
    if (!settings) {
      alert("No settings to export");
      return;
    }

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lumanagi-settings-${new Date().toISOString()}.json`;
    link.click();
  };

  const getSecurityScoreColor = (score) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-[#39ff14]";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const canAccessTab = (tabName) => {
    if (!user) return false;
    
    const rolePermissions = {
      admin: ['personalization', 'security', 'notifications', 'ai'],
      operator: ['personalization', 'security', 'notifications', 'ai'],
      auditor: ['personalization', 'notifications', 'ai'],
      viewer: ['personalization', 'notifications'],
      user: ['personalization', 'notifications'],
      guest: ['personalization']
    };
    
    return rolePermissions[user.role]?.includes(tabName) || false;
  };

  if (!user || !settings) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-white/60">Loading user settings...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Account Settings</h1>
        <p className="text-white/60">Manage your profile, security, and preferences • ISO 27018, ISO 9241-210, ISO 42001</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <GlassCard>
            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative group mb-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-full flex items-center justify-center">
                    {settings.profilePicture ? (
                      <img src={settings.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white text-3xl font-bold">
                        {user?.full_name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{user?.full_name || 'User'}</h3>
                <p className="text-sm text-white/60 mb-3">{user?.email}</p>
                <Badge variant="outline" className="bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/30 mb-2">
                  {user?.role || 'user'}
                </Badge>
                
                {canAccessTab('security') && (
                  <div className="mt-4 w-full p-3 rounded-lg bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/60">Security Score</span>
                      <span className={`text-lg font-bold ${getSecurityScoreColor(settings.securityScore)}`}>
                        {settings.securityScore || 0}%
                      </span>
                    </div>
                    <Progress value={settings.securityScore || 0} className="h-2" />
                    <p className="text-xs text-white/50 mt-1">ISO 27001 Aligned</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-white/60 mb-1">Member Since</p>
                  <p className="text-white font-semibold">{user?.created_date ? new Date(user.created_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <p className="text-xs text-white/60 mb-1">Last Login</p>
                  <p className="text-white font-semibold">Just now</p>
                </div>
                {canAccessTab('ai') && (
                  <div className="p-3 rounded-lg bg-white/5">
                    <p className="text-xs text-white/60 mb-1">AI Decisions</p>
                    <p className="text-white font-semibold">{aiStats.totalDecisions}</p>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Settings Tabs */}
        <div className="lg:col-span-3">
          <GlassCard>
            <div className="p-6">
              <Tabs defaultValue="personalization" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20 mb-6">
                  <TabsTrigger 
                    value="personalization" 
                    className="data-[state=active]:bg-white/20"
                    disabled={!canAccessTab('personalization')}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Personalization
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="data-[state=active]:bg-white/20"
                    disabled={!canAccessTab('security')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="data-[state=active]:bg-white/20"
                    disabled={!canAccessTab('notifications')}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ai" 
                    className="data-[state=active]:bg-white/20"
                    disabled={!canAccessTab('ai')}
                  >
                    🧠 AI
                  </TabsTrigger>
                </TabsList>

                {/* Personalization Tab */}
                <TabsContent value="personalization" className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#3B82F6]/10 to-[#8B5CF6]/10 border border-[#3B82F6]/20">
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-[#3B82F6]" />
                      <div>
                        <p className="text-white font-semibold text-sm">ISO 9241-210 Usability</p>
                        <p className="text-xs text-white/60">Human-centered design principles</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Interface Theme</Label>
                    <Select value={settings.theme || "dark"} onValueChange={(value) => handleSettingChange('theme', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">
                          <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4" />
                            Dark Mode
                          </div>
                        </SelectItem>
                        <SelectItem value="light">
                          <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Light Mode
                          </div>
                        </SelectItem>
                        <SelectItem value="auto">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            Auto (System)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Display Density</Label>
                    <Select value={settings.density || "standard"} onValueChange={(value) => handleSettingChange('density', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Font Size</Label>
                    <Select value={settings.fontSize || "standard"} onValueChange={(value) => handleSettingChange('fontSize', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Timezone
                    </Label>
                    <Select value={settings.timezone || "America/New_York"} onValueChange={(value) => handleSettingChange('timezone', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Language</Label>
                    <Select value={settings.language || "en"} onValueChange={(value) => handleSettingChange('language', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="auto">Auto-detect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-white font-semibold">High Contrast Mode</p>
                      <p className="text-sm text-white/60">Enhance visibility for accessibility</p>
                    </div>
                    <Switch
                      checked={settings.highContrast || false}
                      onCheckedChange={(checked) => handleSettingChange('highContrast', checked)}
                    />
                  </div>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-white font-semibold text-sm">ISO 27001 A.9.2 Access Control</p>
                        <p className="text-xs text-white/60">User access management and authentication</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getSecurityScoreColor(settings.securityScore)}`}>
                        {settings.securityScore || 0}%
                      </p>
                      <p className="text-xs text-white/60">Security Score</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-[#3B82F6]" />
                      <div>
                        <p className="text-white font-semibold">Two-Factor Authentication</p>
                        <p className="text-sm text-white/60">Add an extra layer of security</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {settings.mfaEnabled ? (
                        <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          Disabled
                        </Badge>
                      )}
                      <Switch
                        checked={settings.mfaEnabled || false}
                        onCheckedChange={(checked) => {
                          handleSettingChange('mfaEnabled', checked);
                          calculateSecurityScore(user, { ...settings, mfaEnabled: checked });
                        }}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {!settings.mfaEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
                      >
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-300 font-semibold text-sm">Security Recommendation</p>
                          <p className="text-xs text-yellow-300/80 mt-1">
                            Enabling 2FA will increase your security score by 30% and align with ISO 27001 requirements.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <Label className="text-white mb-3 block">Session Timeout (minutes)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[settings.sessionTimeout || 30]}
                        min={15}
                        max={120}
                        step={15}
                        onValueChange={([value]) => handleSettingChange('sessionTimeout', value)}
                        className="flex-1"
                      />
                      <span className="text-white font-semibold w-16 text-right">{settings.sessionTimeout || 30} min</span>
                    </div>
                    <p className="text-xs text-white/60 mt-2">Auto-logout after inactivity</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Active Sessions
                    </h4>
                    <div className="space-y-2">
                      {sessions.map((session) => (
                        <div key={session.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-white font-medium">{session.device}</p>
                                {session.current && (
                                  <Badge variant="outline" className="bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30 text-xs">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-white/60">
                                <MapPin className="w-3 h-3" />
                                <span>{session.location}</span>
                                <span>•</span>
                                <span>{session.ip}</span>
                              </div>
                              <p className="text-xs text-white/50 mt-1">Last active: {session.lastActive}</p>
                            </div>
                            {!session.current && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30"
                              >
                                <LogOut className="w-3 h-3 mr-1" />
                                Revoke
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30">
                      Logout All Other Sessions
                    </Button>
                  </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#8B5CF6]/10 to-[#A855F7]/10 border border-[#8B5CF6]/20">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-[#8B5CF6]" />
                      <div>
                        <p className="text-white font-semibold text-sm">ISO 27002 A.12.4 Logging</p>
                        <p className="text-xs text-white/60">Event logging and monitoring</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Notification Types</h4>
                    
                    <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-white font-semibold">System Status Updates</p>
                        <p className="text-sm text-white/60">Contract health, oracle status, network alerts</p>
                      </div>
                      <Switch
                        checked={settings.systemStatusUpdates !== false}
                        onCheckedChange={(checked) => handleSettingChange('systemStatusUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-white font-semibold">Policy Change Alerts</p>
                        <p className="text-sm text-white/60">New policies, amendments, governance votes</p>
                      </div>
                      <Switch
                        checked={settings.policyChangeAlerts !== false}
                        onCheckedChange={(checked) => handleSettingChange('policyChangeAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-white font-semibold">AI Decision Notifications</p>
                        <p className="text-sm text-white/60">When AI makes autonomous decisions</p>
                      </div>
                      <Switch
                        checked={settings.aiDecisionNotifications !== false}
                        onCheckedChange={(checked) => handleSettingChange('aiDecisionNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-white font-semibold">Data Insight Alerts</p>
                        <p className="text-sm text-white/60">New patterns, anomalies, predictions</p>
                      </div>
                      <Switch
                        checked={settings.dataInsightAlerts !== false}
                        onCheckedChange={(checked) => handleSettingChange('dataInsightAlerts', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <p className="text-white font-semibold">Weekly Digest</p>
                        <p className="text-sm text-white/60">Summary of key events and metrics</p>
                      </div>
                      <Switch
                        checked={settings.weeklyDigest !== false}
                        onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <h4 className="text-white font-semibold">Delivery Methods</h4>
                    
                    <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center">
                          <Bell className="w-5 h-5 text-[#3B82F6]" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">In-App</p>
                          <p className="text-sm text-white/60">Real-time notifications in dashboard</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.deliveryInApp !== false}
                        onCheckedChange={(checked) => handleSettingChange('deliveryInApp', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#39ff14]/20 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#39ff14]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-semibold">Email</p>
                          <p className="text-sm text-white/60">{user?.email}</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.deliveryEmail !== false}
                        onCheckedChange={(checked) => handleSettingChange('deliveryEmail', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#8B5CF6]/20 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-[#8B5CF6]" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">Webhook/Slack</p>
                          <p className="text-sm text-white/60">External integrations</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.deliveryWebhook || false}
                        onCheckedChange={(checked) => handleSettingChange('deliveryWebhook', checked)}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* AI Tab */}
                <TabsContent value="ai" className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#8B5CF6]/10 to-[#EC4899]/10 border border-[#8B5CF6]/20">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-[#8B5CF6]" />
                      <div>
                        <p className="text-white font-semibold text-sm">ISO 42001 AI Management & ISO 22989 Explainability</p>
                        <p className="text-xs text-white/60">Configure AI behavior and transparency</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Stats Card */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/60 mb-1">Total AI Decisions</p>
                      <p className="text-2xl font-bold text-white">{aiStats.totalDecisions}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/60 mb-1">Override Rate</p>
                      <p className="text-2xl font-bold text-yellow-400">{aiStats.overrideRate}%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs text-white/60 mb-1">AI Trust Score</p>
                      <p className="text-2xl font-bold text-[#39ff14]">{(100 - aiStats.overrideRate).toFixed(1)}%</p>
                    </div>
                  </div>

                  {aiStats.lastOverride && (
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                      <p className="text-xs text-white/60 mb-1">Last Override</p>
                      <p className="text-sm text-white">{aiStats.lastOverride}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-white mb-3 block">AI Suggestion Level</Label>
                    <Select value={settings.aiSuggestionLevel || "balanced"} onValueChange={(value) => handleSettingChange('aiSuggestionLevel', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">
                          <div className="space-y-1">
                            <p className="font-medium">Minimal</p>
                            <p className="text-xs text-white/60">Only show critical suggestions</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="balanced">
                          <div className="space-y-1">
                            <p className="font-medium">Balanced (Recommended)</p>
                            <p className="text-xs text-white/60">Default behavior</p>
                          </div>
                        </SelectItem>
                        <SelectItem value="aggressive">
                          <div className="space-y-1">
                            <p className="font-medium">Aggressive</p>
                            <p className="text-xs text-white/60">Show all patterns, even low-confidence</p>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-white">AI Confidence Threshold</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-[#8B5CF6] font-bold text-lg">{settings.aiConfidenceThreshold || 75}%</span>
                        <button
                          onClick={() => handleSettingChange('aiConfidenceThreshold', 75)}
                          className="text-xs text-white/60 hover:text-white transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    <Slider
                      value={[settings.aiConfidenceThreshold || 75]}
                      min={40}
                      max={99}
                      step={5}
                      onValueChange={([value]) => handleSettingChange('aiConfidenceThreshold', value)}
                      className="mb-2"
                    />
                    <p className="text-xs text-white/60">Only show AI suggestions above this confidence level</p>
                    <div className="mt-2 p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-[#8B5CF6]">💡 Explainability</p>
                      <p className="text-xs text-white/70 mt-1">
                        {(settings.aiConfidenceThreshold || 75) >= 80
                          ? "High threshold = fewer but more reliable suggestions"
                          : (settings.aiConfidenceThreshold || 75) >= 60
                          ? "Balanced threshold = moderate suggestion frequency"
                          : "Low threshold = more suggestions, some may be exploratory"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-3 block">Default AI Response Type</Label>
                    <Select value={settings.aiResponseType || "explainable"} onValueChange={(value) => handleSettingChange('aiResponseType', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="summary">Summary Only</SelectItem>
                        <SelectItem value="explainable">Explainable Path (Recommended)</SelectItem>
                        <SelectItem value="action">Action Proposal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-white font-semibold">Show Explainability First</p>
                      <p className="text-sm text-white/60">Display AI reasoning before action buttons</p>
                      <p className="text-xs text-[#8B5CF6] mt-1">ISO 22989 Transparency</p>
                    </div>
                    <Switch
                      checked={settings.showExplainability !== false}
                      onCheckedChange={(checked) => handleSettingChange('showExplainability', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-white font-semibold">Show Data Origin</p>
                      <p className="text-sm text-white/60">Display which data sources AI used</p>
                    </div>
                    <Switch
                      checked={settings.showDataOrigin !== false}
                      onCheckedChange={(checked) => handleSettingChange('showDataOrigin', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-[#8B5CF6]/10 to-[#EC4899]/10 border border-[#8B5CF6]/30">
                    <div>
                      <p className="text-white font-semibold">AI Feedback Opt-In</p>
                      <p className="text-sm text-white/60">Allow AI to learn from my overrides and corrections</p>
                      <p className="text-xs text-[#8B5CF6] mt-1">Helps improve system accuracy</p>
                    </div>
                    <Switch
                      checked={settings.aiFeedbackOptIn !== false}
                      onCheckedChange={(checked) => handleSettingChange('aiFeedbackOptIn', checked)}
                    />
                  </div>

                  {user?.role === 'admin' && (
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <Label className="text-white mb-3 block">AI Model Selection</Label>
                      <Select defaultValue="gpt-4-turbo">
                        <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Default)</SelectItem>
                          <SelectItem value="claude-3">Claude 3 Opus</SelectItem>
                          <SelectItem value="custom">Custom Model</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-white/60 mt-2">Admin only: Select AI model for decision-making</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Save/Reset Buttons */}
              <AnimatePresence>
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10"
                  >
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      disabled={saving}
                    >
                      Reset Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={exportSettings}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      disabled={saving}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:opacity-90"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}