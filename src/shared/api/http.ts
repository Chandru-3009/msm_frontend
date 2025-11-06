import axios from 'axios'
import { API_URL } from '@/shared/lib/env'

export const http = axios.create({
  baseURL: API_URL || undefined,
  withCredentials: true,
})

http.interceptors.response.use(
  (r) => r,
  (err) => Promise.reject(err)
)


