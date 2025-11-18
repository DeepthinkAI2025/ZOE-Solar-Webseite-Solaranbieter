/**
 * ZOE Solar API Client - JavaScript/TypeScript
 * Complete API client for ZOE Solar Enterprise Platform
 * @version 1.0.0
 * @author ZOE Solar API Team
 */

class ZoeSolarAPI {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'https://zoe-solar.de/api';
    this.apiKey = options.apiKey;
    this.token = options.token || null;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (options.apiKey) {
      this.defaultHeaders['X-API-Key'] = options.apiKey;
    }
  }

  /**
   * Set authentication token
   * @param {string} token - JWT access token
   */
  setToken(token) {
    this.token = token;
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Make API request with error handling
   * @param {string} url - API endpoint URL
   * @param {object} options - Request options
   * @returns {Promise<object>} API response
   */
  async request(url, options = {}) {
    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders },
      ...options,
      url: `${this.baseURL}${url}`,
    };

    // Add authorization header if token is available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(config.url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new APIError(
          data.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data.error?.code
        );
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(`Network error: ${error.message}`, 0, 'NETWORK_ERROR');
    }
  }

  // Authentication Methods
  auth = {
    /**
     * User login
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {object} options - Additional login options
     * @returns {Promise<object>} Login response
     */
    login: async (email, password, options = {}) => {
      return this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          rememberMe: options.rememberMe || false,
          deviceInfo: options.deviceInfo || {}
        })
      });
    },

    /**
     * User registration
     * @param {object} userData - User registration data
     * @returns {Promise<object>} Registration response
     */
    register: async (userData) => {
      return this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    /**
     * Refresh authentication token
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<object>} Token refresh response
     */
    refreshToken: async (refreshToken) => {
      return this.request('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
      });
    },

    /**
     * User logout
     * @param {object} options - Logout options
     * @returns {Promise<object>} Logout response
     */
    logout: async (options = {}) => {
      return this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify(options)
      });
    }
  };

  // Customer Management Methods
  customer = {
    /**
     * Get customer profile
     * @returns {Promise<object>} Customer profile
     */
    getProfile: () => {
      return this.request('/customer/profile');
    },

    /**
     * Update customer profile
     * @param {object} profileData - Profile update data
     * @returns {Promise<object>} Updated profile
     */
    updateProfile: (profileData) => {
      return this.request('/customer/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    },

    /**
     * Get customer projects
     * @param {object} filters - Query filters
     * @returns {Promise<object>} Projects list
     */
    getProjects: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return this.request(`/customer/projects?${params}`);
    },

    /**
     * Create new project
     * @param {object} projectData - Project data
     * @returns {Promise<object>} Created project
     */
    createProject: (projectData) => {
      return this.request('/customer/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
    },

    /**
     * Get project details
     * @param {string} projectId - Project ID
     * @returns {Promise<object>} Project details
     */
    getProject: (projectId) => {
      return this.request(`/customer/projects/${projectId}`);
    },

    /**
     * Get customer analytics
     * @returns {Promise<object>} Analytics data
     */
    getAnalytics: () => {
      return this.request('/customer/analytics');
    }
  };

  // AI Services Methods
  ai = {
    /**
     * Send message to AI chat
     * @param {string} message - Chat message
     * @param {object} context - Chat context
     * @returns {Promise<object>} AI response
     */
    chat: async (message, context = {}) => {
      return this.request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message,
          context,
          options: {
            model: 'mistral-7b-instruct',
            temperature: 0.7,
            includeCalculations: true
          }
        })
      });
    },

    /**
     * Get AI recommendations
     * @param {object} requirements - User requirements
     * @returns {Promise<object>} Recommendations
     */
    getRecommendations: async (requirements) => {
      return this.request('/ai/recommendations', {
        method: 'POST',
        body: JSON.stringify(requirements)
      });
    },

    /**
     * Calculate ROI
     * @param {object} systemSpec - System specifications
     * @param {object} financialParams - Financial parameters
     * @returns {Promise<object>} ROI calculation
     */
    calculateROI: async (systemSpec, financialParams) => {
      return this.request('/ai/roi-calculator', {
        method: 'POST',
        body: JSON.stringify({
          systemSpec,
          financialParameters: financialParams,
          location: {
            address: 'Berlin, Germany',
            coordinates: { lat: 52.5200, lng: 13.4050 }
          }
        })
      });
    },

    /**
     * Analyze solar potential
     * @param {object} locationData - Location data
     * @returns {Promise<object>} Solar potential analysis
     */
    analyzeSolarPotential: async (locationData) => {
      return this.request('/ai/solar-potential', {
        method: 'POST',
        body: JSON.stringify(locationData)
      });
    },

    /**
     * Market analysis
     * @param {object} marketData - Market analysis data
     * @returns {Promise<object>} Market analysis results
     */
    marketAnalysis: async (marketData) => {
      return this.request('/ai/market-analysis', {
        method: 'POST',
        body: JSON.stringify(marketData)
      });
    }
  };

  // Admin Methods
  admin = {
    /**
     * Get dashboard KPIs
     * @returns {Promise<object>} Dashboard metrics
     */
    getDashboardKPIs: () => {
      return this.request('/admin/dashboard/kpi');
    },

    /**
     * Get users list
     * @param {object} filters - User filters
     * @returns {Promise<object>} Users list
     */
    getUsers: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return this.request(`/admin/users?${params}`);
    },

    /**
     * Get SEO analytics
     * @returns {Promise<object>} SEO analytics data
     */
    getSEOAnalytics: () => {
      return this.request('/admin/analytics/seo');
    },

    /**
     * Get system monitoring
     * @returns {Promise<object>} System monitoring data
     */
    getMonitoring: () => {
      return this.request('/admin/monitoring');
    }
  };

  // Utility Methods
  utils = {
    /**
     * Calculate ROI (simplified version)
     * @param {object} params - ROI calculation parameters
     * @returns {Promise<object>} ROI calculation
     */
    calculateROI: async (params) => {
      return this.request('/utils/calculator/roi', {
        method: 'GET',
        params: new URLSearchParams(params)
      });
    },

    /**
     * Check location
     * @param {object} locationData - Location data
     * @returns {Promise<object>} Location analysis
     */
    checkLocation: async (locationData) => {
      return this.request('/utils/location-check', {
        method: 'GET',
        params: new URLSearchParams(locationData)
      });
    }
  };

  // Notion CMS Methods
  notion = {
    /**
     * Get content by type
     * @param {string} type - Content type
     * @param {object} filters - Content filters
     * @returns {Promise<object>} Content data
     */
    getContent: (type, filters = {}) => {
      const params = new URLSearchParams(filters);
      return this.request(`/notion/content/${type}?${params}`);
    },

    /**
     * Search content
     * @param {object} searchParams - Search parameters
     * @returns {Promise<object>} Search results
     */
    searchContent: (searchParams) => {
      return this.request('/notion/search', {
        method: 'GET',
        params: new URLSearchParams(searchParams)
      });
    }
  };
}

// Error class for API errors
class APIError extends Error {
  constructor(message, status, code) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

// Export the class and error
export { ZoeSolarAPI, APIError };

// Export default instance
export default ZoeSolarAPI;

// Utility function to create API instance
export const createAPI = (options) => {
  return new ZoeSolarAPI(options);
};

// Static methods for convenience
export const auth = {
  login: async (email, password) => {
    const api = new ZoeSolarAPI();
    return api.auth.login(email, password);
  },
  register: async (userData) => {
    const api = new ZoeSolarAPI();
    return api.auth.register(userData);
  }
};

export const ai = {
  chat: async (message, context) => {
    const api = new ZoeSolarAPI({ token: localStorage.getItem('zoe_token') });
    return api.ai.chat(message, context);
  },
  calculateROI: async (systemSpec, financialParams) => {
    const api = new ZoeSolarAPI();
    return api.ai.calculateROI(systemSpec, financialParams);
  }
};

export const customer = {
  getProfile: () => {
    const api = new ZoeSolarAPI({ token: localStorage.getItem('zoe_token') });
    return api.customer.getProfile();
  },
  getProjects: (filters) => {
    const api = new ZoeSolarAPI({ token: localStorage.getItem('zoe_token') });
    return api.customer.getProjects(filters);
  }
};

// Example usage:
/*
import { ZoeSolarAPI } from './api-client';

// Create API instance
const api = new ZoeSolarAPI({
  baseURL: 'https://staging.zoe-solar.de/api',
  apiKey: process.env.ZOE_API_KEY
});

// Login
const login = await api.auth.login('email@example.com', 'password');
api.setToken(login.data.tokens.token);

// Get user profile
const profile = await api.customer.getProfile();

// AI Chat
const chatResponse = await api.ai.chat('Welche Solaranlage für 100m²?');

// ROI Calculator
const roiResult = await api.ai.calculateROI(
  { power: 100, moduleType: 'mono_perc' },
  { upfrontCost: 80000 }
);
*/