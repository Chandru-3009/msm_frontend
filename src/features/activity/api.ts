import { http } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import { ActivityRow } from './types'
import activityMock from '@/mocks/activity.json'

export async function fetchActivity(): Promise<ActivityRow[]> {
  if (USE_MOCKS || !API_URL) return activityMock as ActivityRow[]
  try {
    const { data } = await http.get<ActivityRow[]>('/activity')
    return Array.isArray(data) ? data : []
  } catch {
    return activityMock as ActivityRow[]
  }
}


