import { ApiClient } from '@/shared/api/http'
import type { OrderItemRow, OrderSummary } from '@/features/customers/types'
import { QuoteRow } from './types'

export type QuoteQueryParams = {
  search?: string
  customerNames?: string[]
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

export type QuoteListResponse = {
  data: {
    quotes: QuoteRow[]
    pagination: PaginationInfo
  }
}

function buildQueryString(params: QuoteQueryParams): string {
  const query: string[] = []
  if (params.search) query.push(`search=${encodeURIComponent(params.search)}`)
  if (params.customerNames && params.customerNames.length > 0) {
    query.push(`customer_name=${params.customerNames}`)
  }
  if (params.statusIds && params.statusIds.length > 0) {
    query.push(`quote_status=${encodeURIComponent(JSON.stringify(params.statusIds))}`)
  }
  if (typeof params.limit === 'number') query.push(`limit=${params.limit}`)
  if (typeof params.offset === 'number') query.push(`offset=${params.offset}`)
  return query.length ? `?${query.join('&')}` : ''
}

export async function fetchQuotes(params: QuoteQueryParams = {}): Promise<QuoteListResponse> {
  try {
    const qs = buildQueryString(params)
    const { data } = await ApiClient.get<QuoteListResponse>(`/orders/quote-dashboard/list/${qs}`)

    // Backend returns: { data: { quotes: [...], pagination: {...} } }
    const quotes = (data?.data?.quotes && Array.isArray(data.data.quotes)) ? data.data.quotes : []
    const pagination = data?.data?.pagination || {
      total: 0,
      page: 1,
      page_size: 10,
      total_pages: 0,
      has_next_page: false,
      has_previous_page: false,
    }

    return { data: { quotes, pagination } }
  } catch {
    return {
      data: {
        quotes: [],
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

export async function fetchQuoteOrderItems(quoteId: string): Promise<{ summary: OrderSummary; items: OrderItemRow[] }> {
  try {
    const response = await ApiClient.get<any>(`/orders/quotes/${quoteId}/`)
    const apiData = response.data?.data || response.data
    
    // Map API response to OrderSummary
    const summary: OrderSummary = {
      orderId: String(apiData.id || quoteId),
      orderNumber: apiData.quote_number || '',
      status: apiData.quote_status || '',
      date: apiData.quote_date || '',
      customerName: apiData.customer_name || '',
      salesPerson: apiData.sales_person_name || '',
      shipVia: apiData.ship_via || '',
      paymentTerms: apiData.payment_terms || 'Net 30',
      totalItems: apiData.total_items || 0,
      totalQuantityLbs: apiData.total_quantity_lbs || 0,
      totalValueUsd: apiData.total_value || 0,
      items: [],
    }
    
    // Map lines to OrderItemRow
    const items: OrderItemRow[] = (apiData.line_items || apiData.lines || []).map((line: any) => ({
      id: String(line.id),
      partNumber: line.part_number || '',
      type: line.specifications || line.type || '',
      size: line.size || '',
      qtyLbs: parseFloat(line.quantity_lbs || line.ordered_qty) || 0,
      pricePerLb: line.price_per_lb || line.unit_price_per_lb || 0,
      subtotalUsd: line.subtotal || 0,
      lot: line.lot_no || '',
      deliveryDate: line.status || line.delivery_date || '',
    }))
    
    return { summary, items }
  } catch (error) {
    console.error('Error fetching quote items:', error)
    throw error
  }
}




