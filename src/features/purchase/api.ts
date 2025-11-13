import { ApiClient } from '@/shared/api/http'
import { PurchaseRow } from './types'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import purchasesMock from '@/mocks/purchases.json'
import orderItemsMock from '@/mocks/order_items.json'
import type { OrderItemRow, OrderSummary } from '@/features/customers/types'

export async function fetchPurchases(): Promise<PurchaseRow[]> {
  if (USE_MOCKS || !API_URL) {
    return purchasesMock as PurchaseRow[]
  }
  try {
    const { data } = await ApiClient.get<PurchaseRow[]>('/purchases')
    return Array.isArray(data) ? data : []
  } catch {
    // Fallback to mocks if API not ready
    return purchasesMock as PurchaseRow[]
  }
}

export async function fetchPurchaseOrderItems(orderId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
  // Using shared mock for now; in API mode hit /purchase/:id
  return orderItemsMock as { summary: OrderSummary; items: OrderItemRow[] }
}


