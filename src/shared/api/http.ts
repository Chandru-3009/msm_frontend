import axios from 'axios'
import { API_URL } from '@/shared/lib/env'

export const ApiClient = axios.create({
  baseURL: `${API_URL}`,
  timeout: 30000,
  // Remove default Content-Type header to allow axios to set it automatically for FormData
  withCredentials: true,
});

ApiClient.interceptors.request.use(
  (config) => {
      // Add token to Authorization header for all requests if token exists
      const token = localStorage.getItem('authToken');
      const url = config.url ?? '';
      // Do not attach Authorization on login-related endpoints to avoid unnecessary preflight/CORS issues
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');
      if (token && !isAuthEndpoint) {
          config.headers.Authorization = `Bearer ${token}`;
      }
         
      return config;
  },
  (error) => Promise.reject(error)
);


