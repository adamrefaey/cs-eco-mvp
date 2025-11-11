import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Authentication store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: (userData, tokens) => {
        set({
          user: userData,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        set({ user: userData });
      },

      updateTokens: (tokens) => {
        set({
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken || get().refreshToken,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Initialize from localStorage
      initialize: () => {
        const token = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({
              user,
              token,
              refreshToken,
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
        token: state.token,
        refreshToken: state.refreshToken,
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