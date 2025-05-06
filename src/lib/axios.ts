import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '@/stores/authStore';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest?.headers['x-retry']) {
      try {
        // Get new access token
        const newToken = await useAuthStore.getState().refreshAccessToken();
        
        // Retry original request with new token
        if (originalRequest) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          originalRequest.headers['x-retry'] = 'true';
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user and reject promise
        useAuthStore.getState().reset();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;