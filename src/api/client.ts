import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/public';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Required for cookies to be sent with requests
  withCredentials: true,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors - redirect to login
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    if (error.response) {
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error - please check your connection');
    } else {
      throw error;
    }
  }
);

export default apiClient;
