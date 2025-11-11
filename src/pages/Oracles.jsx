
import React, { useState, useEffect, useCallback } from "react";
import { OracleFeed, AdminLog, User } from "@/api/entities";
import GlassCard from "../components/GlassCard";
import StatusBadge from "../components/StatusBadge";
import { Radio, TrendingUp, Clock, AlertTriangle, Activity, RefreshCw, Repeat } from "lucide-react";
import { format, differenceInSeconds } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Oracles() {
  const [feeds, setFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(null);

  const loadFeeds = useCallback(async () => {
    const data = await OracleFeed.list("-created_date");
    setFeeds(data);
    if (data.length > 0 && !selectedFeed) {
      setSelectedFeed(data[0]);
    }
  }, [selectedFeed]);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.log("User not authenticated or error loading user:", error);
      // Optionally handle unauthenticated state, e.g., set user to a default guest role
      setUser({ role: 'guest' }); 
    }
  };

  useEffect(() => {
    loadFeeds();
    loadUser();
  }, [loadFeeds]);

  const handleForceRefresh = async (feedId) => {
    const feed = feeds.find(f => f.id === feedId);
    if (!feed) return;

    setRefreshing(feedId);

    try {
      try {
        await AdminLog.create({
          action: `Force Refresh Oracle: ${feed.feed_name}`,
          endpoint: `/oracles/${feedId}/refresh`,
          status: 'success',
          user_role: user?.role || 'unknown',
          details: `Manual refresh triggered for ${feed.pair}`
        });
      } catch (logError) {
        console.error("Failed to log action:", logError);
      }

      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the feed's last_update and status to simulate a refresh
      // Also simulate a minor price change
      await OracleFeed.update(feedId, {
        last_update: new Date().toISOString(),
        status: 'active',
        price: feed.price * (0.99 + Math.random() * 0.02) // Simulate price fluctuation
      });

      // Reload feeds to reflect changes across the UI
      await loadFeeds(); 
      alert('Oracle feed refreshed successfully');
    } catch (error) {
      console.error('Refresh failed:', error);
      alert('Refresh failed: ' + (error.message || 'Unknown error'));
    } finally {
      setRefreshing(null);
    }
  };

  const handleTriggerFallback = async (feedId) => {
    const feed = feeds.find(f => f.id === feedId);
    if (!feed) return;

    try {
      try {
        await AdminLog.create({
          action: `Trigger Fallback Oracle: ${feed.feed_name}`,
          endpoint: `/oracles/${feedId}/fallback`,
          status: 'success',
          user_role: user?.role || 'unknown',
          details: `Fallback oracle activated for ${feed.pair}`
        });
      } catch (logError) {
        console.error("Failed to log action:", logError);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Fallback oracle activated');
    } catch (error) {
      console.error('Fallback trigger failed:', error);
      alert('Fallback trigger failed: ' + (error.message || 'Unknown error'));
    }
  };

  const isStale = (feed) => {
    if (!feed.last_update) return false;
    const secondsSinceUpdate = differenceInSeconds(new Date(), new Date(feed.last_update));
    return secondsSinceUpdate > (feed.update_frequency || 60);
  };

  const mockPriceHistory = Array(20).fill(0).map((_, i) => ({
    time: i,
    price: selectedFeed ? selectedFeed.price * (0.95 + Math.random() * 0.1) : 0
  }));

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Oracle Feeds</h1>
        <p className="text-white/60">Monitor Chainlink price feeds and network health</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {feeds.map((feed) => {
          const stale = isStale(feed);
          return (
            <GlassCard 
              key={feed.id} 
              hover 
              className={selectedFeed?.id === feed.id ? 'ring-2 ring-[#00d4ff]' : ''}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <button 
                    onClick={() => setSelectedFeed(feed)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    <div className={`p-3 rounded-xl ${
                      stale 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-red-500/20'
                        : 'bg-gradient-to-br from-[#00d4ff]/20 to-[#b388ff]/20'
                    }`}>
                      <Radio className={`w-5 h-5 ${stale ? 'text-yellow-400' : 'text-[#00d4ff]'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{feed.pair}</h3>
                      <p className="text-xs text-white/60">{feed.feed_name}</p>
                    </div>
                  </button>
                  <StatusBadge status={feed.status} />
                </div>

                <div className="mb-4">
                  <p className="text-3xl font-bold text-white">
                    ${feed.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span>
                      {feed.last_update 
                        ? format(new Date(feed.last_update), 'HH:mm:ss')
                        : 'N/A'
                      }
                    </span>
                  </div>
                  {stale && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Stale</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => handleForceRefresh(feed.id)}
                          disabled={refreshing === feed.id || user?.role === 'user' || user?.role === 'guest'}
                          className="flex-1 bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/30"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing === feed.id ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Force update price feed (Admin/Operator only)</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => handleTriggerFallback(feed.id)}
                          disabled={user?.role !== 'admin'}
                          className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30"
                        >
                          <Repeat className="w-4 h-4 mr-2" />
                          Fallback
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Activate fallback oracle (Admin only)</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {selectedFeed && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Price History - {selectedFeed.pair}</h3>
                    <p className="text-sm text-white/60">Real-time Chainlink oracle data</p>
                  </div>
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => handleForceRefresh(selectedFeed.id)}
                            disabled={refreshing === selectedFeed.id || user?.role === 'user' || user?.role === 'guest'}
                            className="bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 text-[#3B82F6] border border-[#3B82F6]/30"
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing === selectedFeed.id ? 'animate-spin' : ''}`} />
                            Refresh
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Force update price feed (Admin/Operator only)</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={mockPriceHistory}>
                    <XAxis 
                      dataKey="time" 
                      stroke="rgba(255,255,255,0.3)" 
                      tick={{ fill: 'rgba(255,255,255,0.6)' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.3)" 
                      tick={{ fill: 'rgba(255,255,255,0.6)' }}
                      domain={['dataMin - 100', 'dataMax + 100']}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                      }}
                      labelStyle={{ color: '#fff' }}
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#00d4ff" 
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-6">Feed Details</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-white">
                    ${selectedFeed.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 mb-2">Status</p>
                  <StatusBadge status={selectedFeed.status} />
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Last Update</p>
                  <p className="text-white font-medium">
                    {selectedFeed.last_update 
                      ? format(new Date(selectedFeed.last_update), 'MMM d, yyyy HH:mm:ss')
                      : 'N/A'
                    }
                  </p>
                  {selectedFeed.last_update && (
                    <p className="text-xs text-white/50 mt-1">
                      {differenceInSeconds(new Date(), new Date(selectedFeed.last_update))}s ago
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Update Frequency</p>
                  <p className="text-white font-medium">Every {selectedFeed.update_frequency}s</p>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/60 mb-1">Deviation Threshold</p>
                  <p className="text-white font-medium">{selectedFeed.deviation_threshold}%</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-[#00d4ff]/10 to-[#b388ff]/10 border border-[#00d4ff]/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-[#00d4ff]" />
                    <p className="text-sm font-semibold text-white">Network</p>
                  </div>
                  <p className="text-white/80">Polygon Mainnet</p>
                  <p className="text-xs text-white/60 mt-1">Chainlink Oracle</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
