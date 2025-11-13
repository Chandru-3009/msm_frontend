import { ApiClient } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import customersMock from '@/mocks/customers.json'
import customerOrdersMock from '@/mocks/customer_orders.json'
import orderItemsMock from '@/mocks/order_items.json'
import { VendorOrderRow, VendorRow } from './types'
import { OrderItemRow, OrderSummary } from '@/features/customers/types'

export async function fetchVendors(): Promise<VendorRow[]> {
  if (USE_MOCKS || !API_URL) {
    // Reuse customers mock to stand in for vendors
    const list = (customersMock as any[]) ?? []
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      totalOrders: c.totalOrders,
      totalQuantityLbs: c.totalQuantityLbs,
      totalValueUsd: c.totalValueUsd,
    })) as VendorRow[]
  }
  try {
    const { data } = await ApiClient.get<VendorRow[]>('/vendors')
    return Array.isArray(data) ? data : []
  } catch {
    const list = (customersMock as any[]) ?? []
    return list.map((c) => ({
      id: c.id,
      name: c.name,
      totalOrders: c.totalOrders,
      totalQuantityLbs: c.totalQuantityLbs,
      totalValueUsd: c.totalValueUsd,
    })) as VendorRow[]
  }
}

export async function fetchVendorOrders(vendorId: string): Promise<VendorOrderRow[]> {
  if (USE_MOCKS || !API_URL) {
    // Reuse customer orders mock and map fields
    const list = (customerOrdersMock as any[]) ?? []
    return list.map((o) => ({
      id: o.id,
      date: o.date,
      poNumber: o.salesOrder,
      items: o.items,
      orderValueLbs: o.orderValueLbs,
      status: o.status,
    })) as VendorOrderRow[]
  }
  try {
    const { data } = await ApiClient.get<VendorOrderRow[]>(`/vendors/${vendorId}/orders`)
    return Array.isArray(data) ? data : []
  } catch {
    const list = (customerOrdersMock as any[]) ?? []
    return list.map((o) => ({
      id: o.id,
      date: o.date,
      poNumber: o.salesOrder,
      items: o.items,
      orderValueLbs: o.orderValueLbs,
      status: o.status,
    })) as VendorOrderRow[]
  }
}

export async function fetchVendorOrderItems(vendorId: string, orderId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
  if (USE_MOCKS || !API_URL) {
    return orderItemsMock as { summary: OrderSummary; items: OrderItemRow[] }
  }
  try {
    const { data } = await ApiClient.get<{ summary: OrderSummary; items: OrderItemRow[] }>(`/vendors/${vendorId}/orders/${orderId}`)
    if (data?.items && data?.summary) return data
    throw new Error('Invalid order items response')
  } catch {
    return orderItemsMock as { summary: OrderSummary; items: OrderItemRow[] }
  }
}


