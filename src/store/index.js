import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Authentication store (using httpOnly cookies for tokens)
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State (only user data, tokens are in httpOnly cookies)
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (userData) => {
        set({
          user: userData,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set({ user: userData });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Initialize from localStorage (only user data)
      initialize: () => {
        const userData = localStorage.getItem('user');

        if (userData) {
          try {
            const user = JSON.parse(userData);
            set({
              user,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Failed to parse user data:', error);
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Application state store
export const useAppStore = create((set, get) => ({
  // UI State
  sidebarCollapsed: {},
  currentPage: 'Dashboard',
  notifications: [],
  
  // Data caches
  entities: {},
  metrics: {},
  
  // Actions
  setSidebarCollapsed: (groupId, collapsed) => {
    set((state) => ({
      sidebarCollapsed: {
        ...state.sidebarCollapsed,
        [groupId]: collapsed,
      },
    }));
  },

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  addNotification: (notification) => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id, timestamp: new Date() },
      ],
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  // Entity cache management
  setEntityData: (entityType, data) => {
    set((state) => ({
      entities: {
        ...state.entities,
        [entityType]: data,
      },
    }));
  },

  getEntityData: (entityType) => {
    return get().entities[entityType] || null;
  },

  // Metrics cache
  setMetrics: (metrics) => {
    set({ metrics });
  },

  getMetrics: () => {
    return get().metrics;
  },
}));

// System status store
export const useSystemStore = create((set, get) => ({
  // System status
  status: {
    overall: 'online',
    components: {
      polygonRPC: 'online',
      oracleNetwork: 'active',
      security: 'protected',
    },
    metrics: {
      uptime: '99.9%',
      agentStatus: 94,
      activeSessions: 0,
    },
  },

  // Live data
  alerts: [],
  activeUsers: 0,
  systemMetrics: {},

  // Actions
  updateSystemStatus: (status) => {
    set((state) => ({
      status: { ...state.status, ...status },
    }));
  },

  updateComponentStatus: (component, status) => {
    set((state) => ({
      status: {
        ...state.status,
        components: {
          ...state.status.components,
          [component]: status,
        },
      },
    }));
  },

  setAlerts: (alerts) => {
    set({ alerts });
  },

  addAlert: (alert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts],
    }));
  },

  removeAlert: (id) => {
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    }));
  },

  updateMetrics: (metrics) => {
    set((state) => ({
      systemMetrics: { ...state.systemMetrics, ...metrics },
    }));
  },
}));