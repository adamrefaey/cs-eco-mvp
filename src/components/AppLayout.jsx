import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import PRISMTrigger from "./PRISMTrigger";
import { auth } from "@/api/auth";
import "@/styles/layout.css";

/**
 * AppLayout Component
 *
 * Main application layout structure providing:
 * - Sidebar navigation
 * - Top header
 * - Main content area
 * - PRISM AI assistant trigger
 *
 * @param {Object} props
 * @param {ReactNode} props.children - Page content
 * @param {string} props.currentPageName - Current page title
 */
export default function AppLayout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0a0118] via-[#0f0520] to-[#1a0b2e]">
        <AppSidebar user={user} onLogout={handleLogout} />

        <div className="flex-1 flex flex-col">
          <AppHeader currentPageName={currentPageName} user={user} />

          <main className="flex-1 overflow-auto">
            {children}
          </main>

          <PRISMTrigger currentPage={currentPageName} />
        </div>
      </div>
    </SidebarProvider>
  );
}
