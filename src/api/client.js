// API client for making authenticated requests to backend services
import axios from 'axios';
import { authService } from './auth.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await authService.refreshAccessToken();
        const newToken = authService.getToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        authService.clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class APIClient {
  constructor() {
    this.axios = axiosInstance;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await this.axios({
        url: endpoint,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error.response?.data || error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    return this.request(endpoint, {
      method: 'GET',
      params,
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      data,
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      data,
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      data,
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Upload file
  async upload(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

// Create singleton instance
export const apiClient = new APIClient();

// Create a client object that mimics the old base44 structure for easier migration
export const client = {
  // Authentication methods
  auth: {
    login: (email, password) => authService.login(email, password),
    register: (userData) => authService.register(userData),
    logout: () => authService.logout(),
    me: () => authService.me(),
    isAuthenticated: () => authService.isAuthenticated(),
    getUser: () => authService.getUser(),
  },

  // Entity operations (mock structure - replace with actual API endpoints)
  entities: {
    ContractMetric: {
      find: (params) => apiClient.get('/contract-metrics', params),
      create: (data) => apiClient.post('/contract-metrics', data),
      update: (id, data) => apiClient.put(`/contract-metrics/${id}`, data),
      delete: (id) => apiClient.delete(`/contract-metrics/${id}`),
    },
    TokenAnalytic: {
      find: (params) => apiClient.get('/token-analytics', params),
      create: (data) => apiClient.post('/token-analytics', data),
      update: (id, data) => apiClient.put(`/token-analytics/${id}`, data),
      delete: (id) => apiClient.delete(`/token-analytics/${id}`),
    },
    Market: {
      find: (params) => apiClient.get('/markets', params),
      create: (data) => apiClient.post('/markets', data),
      update: (id, data) => apiClient.put(`/markets/${id}`, data),
      delete: (id) => apiClient.delete(`/markets/${id}`),
    },
    OracleFeed: {
      find: (params) => apiClient.get('/oracle-feeds', params),
      create: (data) => apiClient.post('/oracle-feeds', data),
      update: (id, data) => apiClient.put(`/oracle-feeds/${id}`, data),
      delete: (id) => apiClient.delete(`/oracle-feeds/${id}`),
    },
    AdminLog: {
      find: (params) => apiClient.get('/admin-logs', params),
      create: (data) => apiClient.post('/admin-logs', data),
    },
    Alert: {
      find: (params) => apiClient.get('/alerts', params),
      create: (data) => apiClient.post('/alerts', data),
      update: (id, data) => apiClient.put(`/alerts/${id}`, data),
      delete: (id) => apiClient.delete(`/alerts/${id}`),
    },
    ComplianceMetric: {
      find: (params) => apiClient.get('/compliance-metrics', params),
      create: (data) => apiClient.post('/compliance-metrics', data),
      update: (id, data) => apiClient.put(`/compliance-metrics/${id}`, data),
    },
    SecurityIncident: {
      find: (params) => apiClient.get('/security-incidents', params),
      create: (data) => apiClient.post('/security-incidents', data),
      update: (id, data) => apiClient.put(`/security-incidents/${id}`, data),
    },
    RiskAssessment: {
      find: (params) => apiClient.get('/risk-assessments', params),
      create: (data) => apiClient.post('/risk-assessments', data),
      update: (id, data) => apiClient.put(`/risk-assessments/${id}`, data),
    },
    AIModelMetric: {
      find: (params) => apiClient.get('/ai-model-metrics', params),
      create: (data) => apiClient.post('/ai-model-metrics', data),
    },
    DataQualityMetric: {
      find: (params) => apiClient.get('/data-quality-metrics', params),
      create: (data) => apiClient.post('/data-quality-metrics', data),
    },
    TrustBoundaryEvent: {
      find: (params) => apiClient.get('/trust-boundary-events', params),
      create: (data) => apiClient.post('/trust-boundary-events', data),
    },
    TemporalAnomaly: {
      find: (params) => apiClient.get('/temporal-anomalies', params),
      create: (data) => apiClient.post('/temporal-anomalies', data),
    },
    TreasuryTransaction: {
      find: (params) => apiClient.get('/treasury-transactions', params),
      create: (data) => apiClient.post('/treasury-transactions', data),
    },
    SimulationScenario: {
      find: (params) => apiClient.get('/simulation-scenarios', params),
      create: (data) => apiClient.post('/simulation-scenarios', data),
      update: (id, data) => apiClient.put(`/simulation-scenarios/${id}`, data),
    },
    AIFeedback: {
      find: (params) => apiClient.get('/ai-feedback', params),
      create: (data) => apiClient.post('/ai-feedback', data),
    },
    ComplianceEvidence: {
      find: (params) => apiClient.get('/compliance-evidence', params),
      create: (data) => apiClient.post('/compliance-evidence', data),
    },
    Agent: {
      find: (params) => apiClient.get('/agents', params),
      create: (data) => apiClient.post('/agents', data),
      update: (id, data) => apiClient.put(`/agents/${id}`, data),
    },
    PolicyState: {
      find: (params) => apiClient.get('/policy-states', params),
      create: (data) => apiClient.post('/policy-states', data),
      update: (id, data) => apiClient.put(`/policy-states/${id}`, data),
    },
    AgentDecisionLog: {
      find: (params) => apiClient.get('/agent-decision-logs', params),
      create: (data) => apiClient.post('/agent-decision-logs', data),
    },
    ConstitutionalRule: {
      find: (params) => apiClient.get('/constitutional-rules', params),
      create: (data) => apiClient.post('/constitutional-rules', data),
      update: (id, data) => apiClient.put(`/constitutional-rules/${id}`, data),
    },
    AgentCluster: {
      find: (params) => apiClient.get('/agent-clusters', params),
      create: (data) => apiClient.post('/agent-clusters', data),
      update: (id, data) => apiClient.put(`/agent-clusters/${id}`, data),
    },
    MetaAudit: {
      find: (params) => apiClient.get('/meta-audits', params),
      create: (data) => apiClient.post('/meta-audits', data),
    },
    GovernanceProposal: {
      find: (params) => apiClient.get('/governance-proposals', params),
      create: (data) => apiClient.post('/governance-proposals', data),
      update: (id, data) => apiClient.put(`/governance-proposals/${id}`, data),
    },
    SystemTrustScore: {
      find: (params) => apiClient.get('/system-trust-scores', params),
      create: (data) => apiClient.post('/system-trust-scores', data),
    },
  },

  // Integration services
  integrations: {
    Core: {
      InvokeLLM: async (params) => {
        return apiClient.post('/integrations/llm/invoke', params);
      },
      SendEmail: async (params) => {
        return apiClient.post('/integrations/email/send', params);
      },
      UploadFile: async (file, metadata = {}) => {
        return apiClient.upload('/integrations/files/upload', file, metadata);
      },
      GenerateImage: async (params) => {
        return apiClient.post('/integrations/images/generate', params);
      },
      ExtractDataFromUploadedFile: async (fileId, options = {}) => {
        return apiClient.post('/integrations/files/extract', { fileId, ...options });
      },
      CreateFileSignedUrl: async (fileName, contentType) => {
        return apiClient.post('/integrations/files/signed-url', { fileName, contentType });
      },
      UploadPrivateFile: async (file, metadata = {}) => {
        return apiClient.upload('/integrations/files/upload-private', file, metadata);
      },
    },
  },
};

export default client;