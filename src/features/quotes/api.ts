import { ApiClient } from '@/shared/api/http'
import { QuoteRow } from './types'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import quotesMock from '@/mocks/quotes.json'
import orderItemsMock from '@/mocks/order_items.json'
import type { OrderItemRow, OrderSummary } from '@/features/customers/types'

export async function fetchQuotes(): Promise<QuoteRow[]> {
  if (USE_MOCKS || !API_URL) {
    return quotesMock as QuoteRow[]
  }
  try {
    const { data } = await ApiClient.get<QuoteRow[]>('/quotes')
    return Array.isArray(data) ? data : []
  } catch {
    // Fallback to mocks if API not ready
    return quotesMock as QuoteRow[]
  }
}

export async function fetchQuoteOrderItems(quoteId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
  // Using shared mock for now; in API mode hit /quotes/:id
  return orderItemsMock as { summary: OrderSummary; items: OrderItemRow[] }
}


