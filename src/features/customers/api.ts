import { ApiClient } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import customersMock from '@/mocks/customers.json'
import customerOrdersMock from '@/mocks/customer_orders.json'
import orderItemsMock from '@/mocks/order_items.json'
import { CustomerOrderRow, CustomerRow, OrderItemRow, OrderSummary } from './types'

export async function fetchCustomers(): Promise<CustomerRow[]> {
  if (USE_MOCKS || !API_URL) {
    return customersMock as CustomerRow[]
  }
  try {
    const { data } = await ApiClient.get<CustomerRow[]>('/customers')
    return Array.isArray(data) ? data : []
  } catch {
    return customersMock as CustomerRow[]
  }
}

export async function fetchCustomerOrders(customerId: string): Promise<CustomerOrderRow[]> {
  if (USE_MOCKS || !API_URL) {
    // in mocks we ignore id and return the same list
    return customerOrdersMock as CustomerOrderRow[]
  }
  try {
    const { data } = await ApiClient.get<CustomerOrderRow[]>(`/customers/${customerId}/orders`)
    return Array.isArray(data) ? data : []
  } catch {
    return customerOrdersMock as CustomerOrderRow[]
  }
}

export async function fetchOrderItems(customerId: string, orderId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
  if (USE_MOCKS || !API_URL) {
    return orderItemsMock as { summary: OrderSummary; items: OrderItemRow[] }
  }
  try {
    const { data } = await ApiClient.get<{ summary: OrderSummary; items: OrderItemRow[] }>(`/customers/${customerId}/orders/${orderId}`)
    if (data?.items && data?.summary) return data
    throw new Error('Invalid order items response')
  } catch {
    return orderItemsMock as { summary: OrderSummary; items: OrderItemRow[] }
  }
}


