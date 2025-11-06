import { http } from '@/shared/api/http'
import { QuoteRow } from './types'

export async function fetchQuotes(): Promise<QuoteRow[]> {
  // Client-side mode: fetch the full list; switch to server params later
  const { data } = await http.get<QuoteRow[]>('/quotes')
  return data
}


