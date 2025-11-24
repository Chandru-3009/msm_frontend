import { z } from 'zod'

const Env = z.object({
  VITE_API_URL: z.string().url().optional(),
  VITE_API_URL_CORE: z.string().url().optional(),
  VITE_API_URL_MSM: z.string().url().optional(),
  VITE_API_URL_GOLAM: z.string().url().optional(),
  VITE_USE_MOCKS: z.string().optional(),
})

export const env = Env.parse(import.meta.env)

// Back-compat: if only VITE_API_URL is provided, treat it as CORE
export const API_URL_CORE = env.VITE_API_URL_CORE ?? env.VITE_API_URL ?? ''
export const API_URL_MSM = env.VITE_API_URL_MSM ?? ''
export const API_URL_GOLAM = env.VITE_API_URL_GOLAM ?? ''

// Back-compat export (prefer API_URL_CORE moving forward)
export const API_URL = API_URL_CORE
export const USE_MOCKS = (env.VITE_USE_MOCKS ?? 'true').toLowerCase() === 'true'


