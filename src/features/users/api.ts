import { ApiClient } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import { UserRow } from './types'
import usersMock from '@/mocks/users.json'

export async function fetchUsers(): Promise<UserRow[]> {
  if (USE_MOCKS || !API_URL) return usersMock as UserRow[]
  try {
    const { data } = await ApiClient.get<UserRow[]>('/users')
    return Array.isArray(data) ? data : []
  } catch {
    return usersMock as UserRow[]
  }
}


