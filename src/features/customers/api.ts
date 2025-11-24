import { ApiClient } from '@/shared/api/http'
import { CustomerOrderRow, CustomerRow } from './types'

export type CustomerQueryParams = {
  search?: string
  limit?: number
  offset?: number
}

export type PaginationInfo = {
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next_page: boolean
  has_previous_page: boolean
}

export type CustomerListResponse = {
  data: {
    customers: CustomerRow[]
    pagination: PaginationInfo
  }
}

export type CustomerSalesHistoryResponse = {
  data: {
    orders: CustomerOrderRow[]
  }
}

function buildQueryString(params: CustomerQueryParams): string {
  const query: string[] = []
  if (params.search) query.push(`search=${encodeURIComponent(params.search)}`)
  if (typeof params.limit === 'number') query.push(`limit=${params.limit}`)
  if (typeof params.offset === 'number') query.push(`offset=${params.offset}`)
  return query.length ? `?${query.join('&')}` : ''
}

export async function fetchCustomers(params: CustomerQueryParams = {}): Promise<CustomerListResponse> {
  try {
    const qs = buildQueryString(params)
    const { data } = await ApiClient.get<CustomerListResponse>(`/customers/list/${qs}`)

    // Backend returns: { data: { customers: [...], pagination: {...} } }
    const customers = (data?.data?.customers && Array.isArray(data.data.customers)) ? data.data.customers : []
    const pagination = data?.data?.pagination || {
      total: 0,
      page: 1,
      page_size: 10,
      total_pages: 0,
      has_next_page: false,
      has_previous_page: false,
    }

    return { data: { customers, pagination } }
  } catch {
    return {
      data: {
        customers: [],
        pagination: {
          total: 0,
          page: 1,
          page_size: 10,
          total_pages: 0,
          has_next_page: false,
          has_previous_page: false,
        },
      },
    }
  }
}

export async function fetchCustomerSalesHistory(customerId: string): Promise<CustomerOrderRow[]> {
  try {
    const { data } = await ApiClient.get<CustomerSalesHistoryResponse>(`/customers/sales-history/${customerId}/`)
    return (data?.data?.orders && Array.isArray(data.data.orders)) ? data.data.orders : []
  } catch {
    return []
  }
}

// Import OrderItemRow and OrderSummary from types
import type { OrderItemRow, OrderSummary } from './types'

export async function fetchSalesOrderItems(orderId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
  try {
    const response = await ApiClient.get<any>(`/orders/purchase-orders/${orderId}/`)
    const apiData = response.data?.data || response.data
    
    // Map API response to OrderSummary
    const summary: OrderSummary = {
      orderId: String(apiData.id || orderId),
      orderNumber: apiData.order_number || '',
      status: apiData.status || '',
      date: apiData.order_date || '',
      customerName: apiData.customer_name || '',
      salesPerson: apiData.sales_person || '',
      shipVia: apiData.ship_via || '',
      paymentTerms: apiData.payment_terms || 'Net 30',
      totalItems: apiData.total_items || 0,
      totalQuantityLbs: apiData.total_quantity_lbs || 0,
      totalValueUsd: apiData.total_value_usd || 0,
      items: [],
    }
    
    // Map lines to OrderItemRow
    const items: OrderItemRow[] = (apiData.line_items || []).map((line: any) => ({
      id: String(line.id),
      partNumber: line.part_number || '',
      type: line.type || '',
      size: line.size || '',
      qtyLbs: parseFloat(line.qty_lbs) || 0,
      pricePerLb: line.price_per_lb || 0,
      subtotalUsd: line.subtotal_usd || 0,
      lot: line.lot || '',
      deliveryDate: line.delivery_date || '',
    }))
    
    return { summary, items }
  } catch (error) {
    console.error('Error fetching sales order items:', error)
    throw error
  }
}


