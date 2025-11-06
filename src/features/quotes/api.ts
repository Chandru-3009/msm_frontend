import { http } from '@/shared/api/http'
import { QuoteRow } from './types'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import quotesMock from '@/mocks/quotes.json'

export async function fetchQuotes(): Promise<QuoteRow[]> {
  if (USE_MOCKS || !API_URL) {
    return quotesMock as QuoteRow[]
  }
  try {
    const { data } = await http.get<QuoteRow[]>('/quotes')
    return Array.isArray(data) ? data : []
  } catch {
    // Fallback to mocks if API not ready
    return quotesMock as QuoteRow[]
  }
}


