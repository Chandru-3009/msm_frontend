import axios from 'axios'
import { API_URL_CORE, API_URL_MSM, API_URL_GOLAM } from '@/shared/lib/env'

function createApiClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    withCredentials: true,
    
    

  })

  client.interceptors.request.use(
    (config) => {
      // Add token to Authorization header for all requests if token exists
      const url = config.url ?? '';
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY0MTI5NDc3LCJpYXQiOjE3NjM1MjQ2NzcsImp0aSI6ImM3ZjVhNjIwNGE1ZTRmZWVhMTQxMTczYzBlMWY0NmE4IiwidXNlcl9pZCI6MX0.i4bZqsAKTo8wdMfMxYfmprhedV2zGHdt2Y-VMZdzovE';
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh');
      if (token && !isAuthEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
      }
         
      return config;
    },
    (error) => Promise.reject(error)
  );

  return client
}

export const ApiCoreClient = createApiClient(`${API_URL_CORE}`)
export const ApiMsmClient = createApiClient(`${API_URL_MSM}`)
export const ApiGolamClient = createApiClient(`${API_URL_GOLAM}`)

// Back-compat default export (use ApiCoreClient moving forward)
export const ApiClient = ApiCoreClient


