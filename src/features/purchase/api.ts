import { ApiClient } from '@/shared/api/http'
import { PurchaseRow } from './types'
import type { OrderItemRow, OrderSummary } from '@/features/customers/types'

export type PurchaseQueryParams = {
  search?: string
  vendorNames?: string[]
  statusIds?: number[]
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

export type PurchaseListResponse = {
  data: {
    purchases: PurchaseRow[]
    pagination: PaginationInfo
  }
}

function buildQueryString(params: PurchaseQueryParams): string {
  const query: string[] = []
  if (params.search) query.push(`search=${encodeURIComponent(params.search)}`)
  if (params.vendorNames && params.vendorNames.length > 0) {
    query.push(`vendor_name=${params.vendorNames}`)
  }
  if (params.statusIds && params.statusIds.length > 0) {
    query.push(`order_status=${encodeURIComponent(JSON.stringify(params.statusIds))}`)
  }
  if (typeof params.limit === 'number') query.push(`limit=${params.limit}`)
  if (typeof params.offset === 'number') query.push(`offset=${params.offset}`)
  return query.length ? `?${query.join('&')}` : ''
}

export async function fetchPurchases(params: PurchaseQueryParams = {}): Promise<PurchaseListResponse> {
  try {
    const qs = buildQueryString(params)
    const { data } = await ApiClient.get<PurchaseListResponse>(`/orders/purchase-dashboard/list/${qs}`)

    // Backend returns: { data: { purchases: [...], pagination: {...} } }
    const purchases = (data?.data?.purchases && Array.isArray(data.data.purchases)) ? data.data.purchases : []
    const pagination = data?.data?.pagination || {
      total: 0,
      page: 1,
      page_size: 10,
      total_pages: 0,
      has_next_page: false,
      has_previous_page: false,
    }

    return { data: { purchases, pagination } }
  } catch {
    return {
      data: {
        purchases: [],
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

export async function fetchPurchaseOrderItems(orderId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
  try {
    const response = await ApiClient.get<any>(`/orders/purchase-orders/${orderId}/`)
    const apiData = response.data?.data || response.data
    
    // Map API response to OrderSummary
    const summary: OrderSummary = {
      orderId: String(apiData.id || orderId),
      orderNumber: apiData.po_number || '',
      status: apiData.order_status || '',
      date: apiData.order_date || '',
      vendor: apiData.vendor_name || '',
      fob: apiData.fob || '',
      freightCostUsd: apiData.freight_cost || 0,
      expectedDelivery: apiData.eta_date || '',
      paymentTerms: apiData.payment_terms || 'Net 30',
      totalItems: apiData.total_items || 0,
      totalQuantityLbs: apiData.total_order_qty || 0,
      totalValueUsd: apiData.total_order_value || 0,
      customerName: '',
      salesPerson: '',
      shipVia: '',
      items: [],
    }
    
    // Map lines to OrderItemRow
    const items: OrderItemRow[] = (apiData.line_items|| []).map((line: any) => ({
      id: String(line.id),
      partNumber: line.part_number || '',
      size: line.size || '',
      grade: line.grade || '',
      ordered_qty_lbs: parseFloat(line.ordered_qty_lbs) || 0,
      received_qty_lbs: parseFloat(line.received_qty_lbs) || 0,
      unit_price_per_lb: line.unit_price_per_lb || 0,
      subtotalUsd: line.subtotal || 0,
      expected_ship_date: line.expected_ship_date || '',
    }))
    
    return { summary, items }
  } catch (error) {
    console.error('Error fetching purchase order items:', error)
    throw error
  }
}




