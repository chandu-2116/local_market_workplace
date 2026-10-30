/**
 * UrbanFix Frontend API Client
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('urbanfix_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on unauthorized if token expired
      if (localStorage.getItem('urbanfix_token')) {
        localStorage.removeItem('urbanfix_token');
        localStorage.removeItem('urbanfix_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
