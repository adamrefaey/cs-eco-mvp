import React from "react";
import { Link } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createPageUrl } from "@/utils";

/**
 * AppHeader Component
 *
 * Top header with:
 * - Sidebar trigger
 * - Page title
 * - Search button
 * - Notifications
 * - User avatar
 *
 * @param {Object} props
 * @param {string} props.currentPageName - Current page title
 * @param {Object} props.user - User object with full_name
 */
export default function AppHeader({ currentPageName, user }) {
  return (
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
  );
}
