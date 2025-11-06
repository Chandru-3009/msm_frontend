import { z } from 'zod'

const Env = z.object({
  VITE_API_URL: z.string().url().optional(),
  VITE_USE_MOCKS: z.string().optional(),
})

export const env = Env.parse(import.meta.env)
export const API_URL = env.VITE_API_URL ?? ''
export const USE_MOCKS = (env.VITE_USE_MOCKS ?? 'true').toLowerCase() === 'true'


