// JWT-based authentication system using httpOnly cookies
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance for auth with cookie support
const authAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: sends cookies with requests
});

class AuthService {
  constructor() {
    this.user = null;
    this.init();
  }

  init() {
    // Load user data from localStorage (only user info, not tokens)
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
      this.user = data.user;

      // Store only user info (tokens are in httpOnly cookies)
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
      const data = response.data;
      this.user = data.user;

      // Store only user info (tokens are in httpOnly cookies)
      localStorage.setItem('user', JSON.stringify(this.user));

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || error;
    }
  }

  async logout() {
    try {
      // Cookies are automatically sent with the request
      await authAxios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  async me() {
    try {
      // Cookies are automatically sent with the request
      const response = await authAxios.get('/auth/me');

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
    try {
      // Cookies are automatically sent with the request
      // Backend will validate refresh token cookie and set new cookies
      const response = await authAxios.post('/auth/refresh');
      return response.data;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      throw error.response?.data || error;
    }
  }

  clearAuth() {
    this.user = null;
    localStorage.removeItem('user');
    // Note: httpOnly cookies are cleared by the server on logout
  }

  isAuthenticated() {
    // Check if we have user data (tokens are in cookies)
    return !!this.user;
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
  getUser: () => authService.getUser(),
  clearAuth: () => authService.clearAuth(),
};

export default authService;