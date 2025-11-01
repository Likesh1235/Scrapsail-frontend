/**
 * API Helper Utility
 * Provides centralized API call functions with error handling and connection checks
 */

import API_CONFIG from '../config/api';

/**
 * Get the base API URL
 */
export const getApiBaseUrl = () => {
  // Prioritize REACT_APP_API_BASE_URL (standard), fallback to REACT_APP_API_URL
  return process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || API_CONFIG.SPRING_BOOT_URL;
};

/**
 * Check if the backend server is reachable
 * @returns {Promise<boolean>}
 */
export const checkBackendConnection = async () => {
  try {
    const baseUrl = getApiBaseUrl();
    // Use health endpoint for better reliability
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data.status === 'UP';
    }
    return false;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
};

/**
 * Make an API call with error handling
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const apiCall = async (endpoint, options = {}) => {
  const baseUrl = getApiBaseUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('CONNECTION_ERROR: Cannot connect to backend server. Please ensure it is running on ' + baseUrl);
    }
    throw error;
  }
};

/**
 * Get user-friendly error message
 * @param {Error} error - Error object
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  if (error.message && error.message.includes('CONNECTION_ERROR')) {
    return 'Cannot connect to server. Please ensure the backend is running on http://localhost:8080';
  }
  return error.message || 'An unexpected error occurred';
};

