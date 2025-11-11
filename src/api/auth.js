// JWT-based authentication system replacing Base44 auth
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance for auth (no interceptors to avoid circular dependencies)
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

class AuthService {
  constructor() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    this.init();
  }

  init() {
    // Load tokens from localStorage on initialization
    this.token = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (e) {
        console.error('Failed to parse user data from localStorage');
        this.clearAuth();
      }
    }
  }

  async login(email, password) {
    try {
      const response = await authAxios.post('/auth/login', {
        email,
        password,
      });

      const data = response.data;
      
      this.token = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.user = data.user;

      // Store in localStorage
      localStorage.setItem('access_token', this.token);
      localStorage.setItem('refresh_token', this.refreshToken);
      localStorage.setItem('user', JSON.stringify(this.user));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error;
    }
  }

  async register(userData) {
    try {
      const response = await authAxios.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || error;
    }
  }

  async logout() {
    try {
      if (this.refreshToken) {
        await authAxios.post('/auth/logout', {
          refreshToken: this.refreshToken,
        }, {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async me() {
    if (!this.token) {
      throw new Error('No access token available');
    }

    try {
      const response = await authAxios.get('/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      const userData = response.data;
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(this.user));
      
      return userData;
    } catch (error) {
      if (error.response?.status === 401) {
        // Try to refresh token
        try {
          await this.refreshAccessToken();
          return this.me(); // Retry
        } catch (refreshError) {
          this.clearAuth();
          throw refreshError;
        }
      }
      
      console.error('Failed to fetch user:', error);
      this.clearAuth();
      throw error.response?.data || error;
    }
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authAxios.post('/auth/refresh', {
        refreshToken: this.refreshToken,
      });

      const data = response.data;
      
      this.token = data.accessToken;
      if (data.refreshToken) {
        this.refreshToken = data.refreshToken;
      }

      localStorage.setItem('access_token', this.token);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', this.refreshToken);
      }

      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      throw error.response?.data || error;
    }
  }

  clearAuth() {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }
}

// Create a singleton instance
export const authService = new AuthService();

// Export for backward compatibility and ease of use
export const auth = {
  login: (email, password) => authService.login(email, password),
  register: (userData) => authService.register(userData),
  logout: () => authService.logout(),
  me: () => authService.me(),
  isAuthenticated: () => authService.isAuthenticated(),
  getToken: () => authService.getToken(),
  getUser: () => authService.getUser(),
  clearAuth: () => authService.clearAuth(),
  authenticatedFetch: (url, options) => authService.authenticatedFetch(url, options),
};

export default authService;