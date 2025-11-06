import { http } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import { SalesRow } from './types'
import salesMock from '@/mocks/sales.json'

export async function fetchSales(): Promise<SalesRow[]> {
  if (USE_MOCKS || !API_URL) {
    return salesMock as SalesRow[]
  }
  try {
    const { data } = await http.get<SalesRow[]>('/sales')
    return Array.isArray(data) ? data : []
  } catch {
    return salesMock as SalesRow[]
  }
}


