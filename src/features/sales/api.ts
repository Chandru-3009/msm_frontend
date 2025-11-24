import { ApiClient,ApiGolamClient } from '@/shared/api/http'
import { SalesMetrics, SalesRow } from './types'
import type { OrderItemRow, OrderSummary } from '@/features/customers/types'
import { IdName } from '@/shared/hooks/useFilterOptions'

export type SalesQueryParams = {
  search?: string
  customerNames?: string[]
  statusIds?: number[]
  limit?: number
  offset?: number
}

export type CustomerQueryParams = {
  limit?: number
  offset?: number
  search?: string
}

export type Customer = {
  id: number
  customer_code: string
  customer_name: string
  customer_type: string
  contact_person: string
  email: string
  phone: string
  is_active: boolean
}

export type CustomerListResponse = {
  data: Customer[]
  pagination: PaginationInfo
}

export type PaginationInfo = {
  total: number
  page: number
  page_size: number
  total_pages: number
  has_next_page: boolean
  has_previous_page: boolean
}

export type SalesListResponse = {
  data: {
    items: SalesRow[]
    pagination: PaginationInfo
  }
}

function buildQueryString(params: SalesQueryParams): string {
  const query: string[] = []
  if (params.search) query.push(`search=${encodeURIComponent(params.search)}`)
  if (params.customerNames && params.customerNames.length > 0) {
    query.push(`customer_name=${params.customerNames}`);
  }
  if (params.statusIds && params.statusIds.length > 0) {
    query.push(`order_status=${encodeURIComponent(JSON.stringify(params.statusIds))}`)
  }
  if (typeof params.limit === 'number') query.push(`limit=${params.limit}`)
  if (typeof params.offset === 'number') query.push(`offset=${params.offset}`)
  return query.length ? `?${query.join('&')}` : ''
}

export async function fetchSales(params: SalesQueryParams = {}): Promise<SalesListResponse> {
  try {
    const qs = buildQueryString(params)
    const { data } = await ApiClient.get<SalesListResponse>(`/orders/sales-orders/${qs}`)

    // Backend returns: { data: { items: [...], pagination: {...} } }
    const items = (data?.data?.items && Array.isArray(data.data.items)) ? data.data.items : []
    const pagination = data?.data?.pagination || {
      total: 0,
      page: 1,
      page_size: 10,
      total_pages: 0,
      has_next_page: false,
      has_previous_page: false,
    }

    return { data: { items, pagination } }
  } catch {
    return {
      data: {
        items: [],
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

export async function fetchSalesOrderItems(orderId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
  try {
    const response = await ApiGolamClient.get<any>(`/orders/sales-orders/${orderId}`)
    const apiData = response.data?.data || response.data
    
    // Map API response to OrderSummary
    const summary: OrderSummary = {
      orderId: String(apiData.id || orderId),
      orderNumber: apiData.order_number || '',
      status: apiData.order_status || '',
      date: apiData.order_date || '',
      customerOrder: apiData.customer_po || '',
      customerName: apiData.customer_name || '',
      salesPerson: apiData.sales_person_name || '',
      shipVia: apiData.ship_via || '',
      paymentTerms: apiData.payment_terms || 'Net 30',
      totalItems: apiData.total_items || 0,
      totalQuantityLbs: apiData.total_order_qty || 0,
      totalValueUsd: apiData.total_order_value || 0,
      items: [], // Populated below
    }
    
    // Map lines to OrderItemRow
    const items: OrderItemRow[] = (apiData.lines || []).map((line: any) => ({
      id: String(line.id),
      partNumber: line.part_number || '',
      type: line.type || '',
      size: line.size || '',
      qtyLbs: parseFloat(line.ordered_qty) || 0,
      pricePerLb: line.price_per_lb || 0,
      subtotalUsd: line.subtotal || 0,
      lot: line.lot_no || '',
      deliveryDate: line.delivery_date || '',
    }))
    
    return { summary, items }
  } catch (error) {
    console.error('Error fetching sales order items:', error)
    throw error
  }
}


export async function fetchSalesMetrics(): Promise<SalesMetrics> {
  try {
    const { data } = await ApiClient.get<SalesMetrics>('/orders/sales-orders/summary/')
    // console.log(data)
    const source = data?.data ?? {}



    return { data: source }
  } catch {
    return { data: {
      avg_order_value: '0',
      avg_order_value_change: '0',
      total_orders: '0',
      total_quantity_lbs: '0',
      total_quantity_lbs_change: '0',
      total_revenue: '0',
      total_revenue_change: '0',
    } }
  }
}




export async function fetchSalesFilterDeliveryStatuses(): Promise<IdName[]> {
  const { data } = await ApiClient.get<any>('/orders/sales-orders/statuses/')
  return Array.isArray(data?.data) ? data.data as IdName[] : []
}

export async function fetchSalesFilterCustomers(
  params: CustomerQueryParams = {}
): Promise<CustomerListResponse> {
  const query: string[] = []
  if (params.search) query.push(`search=${encodeURIComponent(params.search)}`)
  if (typeof params.limit === 'number') query.push(`limit=${params.limit}`)
  if (typeof params.offset === 'number') query.push(`offset=${params.offset}`)
  const qs = query.length ? `?${query.join('&')}` : ''
  
  try {
    const { data } = await ApiClient.get<any>(`/orders/customers/${qs}`)
    
    // Handle both response structures: { data: { items: [...] } } or { data: [...] }
    const items = (data?.data?.items && Array.isArray(data.data.items)) ? data.data.items : []
    const paginationData = data?.pagination || data?.data?.pagination || {
      total: items.length,
      page: 1,
      page_size: 50,
      total_pages: Math.ceil(items.length / 50),
      has_next_page: false,
      has_previous_page: false,
    }
    
    return {
      data: items,
      pagination: paginationData
    }
  } catch (error) {
    console.error('Error fetching customers:', error)
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        page_size: 50,
        total_pages: 0,
        has_next_page: false,
        has_previous_page: false,
      }
    }
  }
}