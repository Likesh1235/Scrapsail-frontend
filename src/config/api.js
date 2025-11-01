// API Configuration for ScrapSail Frontend
// Centralized configuration for all API endpoints

import API_BASE_URL from '../api';

export const API_CONFIG = {
  // Backend API Base URL
  BASE_URL: API_BASE_URL,
  SPRING_BOOT_URL: API_BASE_URL,
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/auth/login',
      ADMIN_LOGIN: '/api/auth/admin-login',
      COLLECTOR_LOGIN: '/api/auth/collector-login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout'
    },
    
    // OTP Service
    OTP: {
      SEND: '/api/otp/send',
      VERIFY: '/api/otp/verify'
    },
    
    // Orders
    ORDERS: {
      CREATE: '/api/orders',
      LIST: '/api/orders',
      BY_USER: '/api/orders/user',
      BY_STATUS: '/api/orders/status'
    },
    
    // Wallet
    WALLET: {
      BALANCE: '/api/wallet',
      TRANSACTIONS: '/api/wallet/transactions',
      REDEEM: '/api/wallet/redeem'
    },
    
    // Admin
    ADMIN: {
      PICKUPS: '/api/admin/pickups',
      USERS: '/api/admin/users',
      ASSIGN: '/api/admin/assign'
    },
    
    // Leaderboard
    LEADERBOARD: '/api/leaderboard',
    
    // Credits
    CREDITS: '/api/credits',
    
    // Health
    HEALTH: '/health'
  }
};

// Helper function to get full URL for any endpoint
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper functions for specific endpoints
export const getAuthUrl = (endpoint) => getApiUrl(API_CONFIG.ENDPOINTS.AUTH[endpoint]);
export const getOTPUrl = (endpoint) => getApiUrl(API_CONFIG.ENDPOINTS.OTP[endpoint]);
export const getOrderUrl = (endpoint) => getApiUrl(API_CONFIG.ENDPOINTS.ORDERS[endpoint]);

export default API_CONFIG;
