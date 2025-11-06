import { z } from 'zod'

const Env = z.object({
  VITE_API_URL: z.string().url().optional(),
})

export const env = Env.parse(import.meta.env)
export const API_URL = env.VITE_API_URL ?? ''


