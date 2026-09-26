import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://fakestoreapi.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token if present
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('mb_auth_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch {
        // Ignore malformed localStorage entry
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      'Something went wrong. Please try again.';

    // Attach a normalized message for uniform error handling in components
    error.userMessage = typeof message === 'string' ? message : 'An unexpected error occurred.';

    if (error.response?.status === 401) {
      // Clear stale auth on 401
      localStorage.removeItem('mb_auth_user');
    }

    return Promise.reject(error);
  }
);

export default api;
