import { ApiClient } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import { SalesRow } from './types'
import salesMock from '@/mocks/sales.json'
import orderItemsMock from '@/mocks/order_items.json'
import type { OrderItemRow, OrderSummary } from '@/features/customers/types'

export async function fetchSales(): Promise<SalesRow[]> {
  if (USE_MOCKS || !API_URL) {
    return salesMock as SalesRow[]
  }
  try {
    const { data } = await ApiClient.get<SalesRow[]>('/sales')
    return Array.isArray(data) ? data : []
  } catch {
    return salesMock as SalesRow[]
  }
}

export async function fetchSalesOrderItems(orderId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
  // Using shared mock for now; in API mode hit /sales/:id
  return orderItemsMock as { summary: OrderSummary; items: OrderItemRow[] }
}


