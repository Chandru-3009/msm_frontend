import { ApiClient } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import customersMock from '@/mocks/customers.json'
import customerOrdersMock from '@/mocks/customer_orders.json'
import orderItemsMock from '@/mocks/order_items.json'
import { VendorOrderRow, VendorRow } from './types'
import { OrderItemRow, OrderSummary } from '@/features/customers/types'

export async function fetchVendors(): Promise<VendorRow[]> {

  try {
    const { data } = await ApiClient.get<{ data: { vendors: VendorRow[] } }>('/vendors/list/')
    return Array.isArray(data.data.vendors) ? data.data.vendors : []
  } catch {
    return []
  }
}

export async function fetchVendorOrders(vendorId: string): Promise<VendorOrderRow[]> {
  try {
    const { data } = await ApiClient.get<{ data: { purchases: VendorOrderRow[] } }>(`/vendors/purchase-history/${vendorId}/`)
    return Array.isArray(data.data.purchases) ? data.data.purchases : []
  } catch {
    return []
  }
}

export async function fetchVendorOrderItems(vendorId: string, orderId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
    try {
    const { data } = await ApiClient.get<{ summary: OrderSummary; items: OrderItemRow[] }>(`/orders/purchase-orders/${orderId}/`)
    return data
  } catch {
    return { summary: { orderId: '', orderNumber: '', status: '', date: '', customerName: '', salesPerson: '', shipVia: '', paymentTerms: '', totalItems: 0, totalQuantityLbs: 0, totalValueUsd: 0, items: [] }, items: [] }
  }
}


