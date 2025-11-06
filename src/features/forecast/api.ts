import { http } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import { ForecastRow } from './types'
import forecastMock from '@/mocks/forecast.json'

export async function fetchForecast(): Promise<ForecastRow[]> {
  if (USE_MOCKS || !API_URL) {
    return forecastMock as ForecastRow[]
  }
  try {
    const { data } = await http.get<ForecastRow[]>('/forecast')
    return Array.isArray(data) ? data : []
  } catch {
    return forecastMock as ForecastRow[]
  }
}


