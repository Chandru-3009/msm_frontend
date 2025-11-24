import { ApiCoreClient } from '@/shared/api/http'
import { InventoryRow } from './types'
import { InventoryDetail } from './types.detail'

export type IdName = { id: number; value: string }

export type InventoryQueryParams = {
  search?: string
  productTypeIds?: number[]
  valueRangeIds?: number[]
  daysUntilStockoutIds?: number[]
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

export type InventoryListResponse = {
  data: {
    items: InventoryRow[]
    pagination: PaginationInfo
  }
}

function buildQueryString(params: InventoryQueryParams): string {
  const query: string[] = []
  if (params.search) query.push(`search=${encodeURIComponent(params.search)}`)
  if (params.productTypeIds && params.productTypeIds.length > 0) {
    query.push(`product_types=${encodeURIComponent(JSON.stringify(params.productTypeIds))}`)
  }
  if (params.valueRangeIds && params.valueRangeIds.length > 0) {
    query.push(`value_ranges=${encodeURIComponent(JSON.stringify(params.valueRangeIds))}`)
  }
  if (params.daysUntilStockoutIds && params.daysUntilStockoutIds.length > 0) {
    query.push(`days_until_stockout=${encodeURIComponent(JSON.stringify(params.daysUntilStockoutIds))}`)
  }
  if (params.statusIds && params.statusIds.length > 0) {
    query.push(`statuses=${encodeURIComponent(JSON.stringify(params.statusIds))}`)
  }
  if (typeof params.limit === 'number') query.push(`limit=${params.limit}`)
  if (typeof params.offset === 'number') query.push(`offset=${params.offset}`)
  return query.length ? `?${query.join('&')}` : ''
}

export async function fetchInventory(params: InventoryQueryParams): Promise<InventoryListResponse> {
  try {
    const qs = buildQueryString(params)
    const { data } = await ApiCoreClient.get<InventoryListResponse>(`/table/items/${qs}`)

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

export async function fetchInventoryDetail(id: string): Promise<InventoryDetail> {
  try {
    const { data } = await ApiCoreClient.get<InventoryDetail>(`/inventory/${id}?mock=true`)
    if (data?.id) return data
    throw new Error('bad data')
  } catch (err) {
    throw err
  }
}

export async function fetchInventoryFilterStatuses(): Promise<IdName[]> {
  const { data } = await ApiCoreClient.get<any>('/table/filters/statuses/')
  return Array.isArray(data?.data) ? data.data as IdName[] : []
}

export async function fetchInventoryFilterProductTypes(): Promise<IdName[]> {
  const { data } = await ApiCoreClient.get<any>('/table/filters/product-types/')
  return Array.isArray(data?.data) ? data.data as IdName[] : []
}

export async function fetchInventoryFilterValueRanges(): Promise<IdName[]> {
  const { data } = await ApiCoreClient.get<any>('/table/filters/value-ranges/')
  return Array.isArray(data?.data) ? data.data as IdName[] : []
}

export async function fetchInventoryFilterDaysUntilStockout(): Promise<IdName[]> {
  const { data } = await ApiCoreClient.get<any>('/table/filters/days-until-stockout/')
  return Array.isArray(data?.data) ? data.data as IdName[] : []
}

export type InventoryMetrics = {
  data: {
  total_items: string
  total_value: string
  available_value: string
    allocated_value: string
    total_value_change: string
    available_value_change: string
    allocated_value_change: string
  }
}

export async function fetchInventoryMetrics(): Promise<InventoryMetrics> {
  try {
    const { data } = await ApiCoreClient.get<InventoryMetrics>('/table/summary/')

    const source = data?.data ?? {}
    return { data: source }
  } catch {
    return { data: {
      total_items: '0',
      total_value: '0',
      available_value: '0',
      allocated_value: '0',
      total_value_change: '0',
      available_value_change: '0',
      allocated_value_change: '0',
    } }
    }
}

// Sales History Types
export type SalesHistoryItem = {
  order_id: number
  order_date: string
  customer_name: string
  qty: number
  order_value: number
  price_per_unit: number
}

export type HistoryStats = {
  qty: number
  previous_period_value: number
  percentage_change: number
  trend: 'increased' | 'decreased'
}

export type SalesHistoryResponse = {
  success: boolean
  message: string
  data: {
    stats: {
      top_customer_name: string
      top_customer_order_count_percentage: number
      total_sales_in_12_months: number
      avg_price_per_lb: number
    }
    last_7_days_sale_history: HistoryStats
    last_15_days_sale_history: HistoryStats
    last_30_days_sale_history: HistoryStats
    items: SalesHistoryItem[]
    pagination: PaginationInfo
  }
}

// Quote History Types
export type QuoteHistoryItem = {
  quote_id: number
  quote_date: string
  customer_name: string
  quote_status: string
  qty: number
  quote_value: number
  price_per_unit: number
}

export type QuoteHistoryResponse = {
  success: boolean
  message: string
  data: {
    stats: {
      top_customer_name: string
      top_customer_quote_count_percentage: number
      total_quotes_in_12_months: number
      avg_price_per_lb: number
    }
    last_7_days_quote_history: HistoryStats
    last_15_days_quote_history: HistoryStats
    last_30_days_quote_history: HistoryStats
    items: QuoteHistoryItem[]
    pagination: PaginationInfo
  }
}

// Purchase History Types
export type PurchaseHistoryItem = {
  po_id: number
  order_date: string
  vendor_name: string
  qty: number
  order_value: number
  cost_per_unit: number
}

export type PurchaseHistoryResponse = {
  success: boolean
  message: string
  data: {
    stats: {
      top_vendor_name: string
      top_vendor_order_count_percentage: number
      total_purchases_in_12_months: number
      avg_cost_per_lb: number
    }
    last_7_days_purchase_history: HistoryStats
    last_15_days_purchase_history: HistoryStats
    last_30_days_purchase_history: HistoryStats
    items: PurchaseHistoryItem[]
    pagination: PaginationInfo
  }
}

// API Functions
export async function fetchSalesHistory(id: string, page: number = 1): Promise<SalesHistoryResponse> {
  try {
    const { data } = await ApiCoreClient.get<SalesHistoryResponse>(`/inventory/${id}/sales-history/?page=${page}`)
    return data
  } catch (error) {
    console.error('Error fetching sales history:', error)
    throw error
  }
}

export async function fetchQuoteHistory(id: string, page: number = 1): Promise<QuoteHistoryResponse> {
  try {
    const { data } = await ApiCoreClient.get<QuoteHistoryResponse>(`/inventory/${id}/quote-history/?page=${page}`)
    return data
  } catch (error) {
    console.error('Error fetching quote history:', error)
    throw error
  }
}

export async function fetchPurchaseHistory(id: string, page: number = 1): Promise<PurchaseHistoryResponse> {
  try {
    const { data } = await ApiCoreClient.get<PurchaseHistoryResponse>(`/inventory/${id}/purchase-history/?page=${page}`)
    return data
  } catch (error) {
    console.error('Error fetching purchase history:', error)
    throw error
  }
}

// Stock Status Types
export type StockStatusResponse = {
  success: boolean
  message: string
  data: {
    product_summary: {
      sku: string
      description: string
      unit_of_measure: string
      alert_level: string
      demand_trend: string
      display_code: string
      last_7_days_stats: {
        item_quote_amount: number
        item_quote_trend: string
        item_sales_order_amount: number
        item_sales_order_trend: string
        item_purchase_order_amount: number
        item_purchase_order_trend: string
      }
    }
    stock_status: {
      total_stock: number
      open_customer_orders: number
      last_customer_order_date: string
      stockout_in_months: number
      open_vendor_orders: number
      last_vendor_order_date: string
      reorder_by_date: string
      reorder_quantity: number
    }
    purchase_recommendation: {
      recommended_quantity: number
      deadline: string
      urgency: string
    }
    vendor_information: {
      primary_vendor: {
        name: string
        last_purchased_price: number
        price_unit: string
        average_order_quantity: number
        average_lead_time_days: number
        last_order_date: string
        last_order_quantity: number
      }
      vendor_comparison_available: boolean
      available_vendors: Array<{
        name: string
        price: number
        price_unit: string
        average_order_quantity: number
        average_lead_time_days: number
        recommended: boolean
      }>
    }
  }
}

export async function fetchStockStatus(id: string): Promise<StockStatusResponse> {
  try {
    const { data } = await ApiCoreClient.get<StockStatusResponse>(`/inventory/${id}/?mock=true`)
    return data
  } catch (error) {
    console.error('Error fetching stock status:', error)
    throw error
  }
}

// Pricing History Types
export type PricingHistoryDataPoint = {
  name: string
  vendor: string
  'Avg Price': number
  Quantity: number
  Total: number
  value: number
}

export type PricingHistoryResponse = {
  result: boolean
  msg: string
  data: {
    lowest_price: number
    highest_price: number
    average_price: number
    pricing_data: PricingHistoryDataPoint[]
  }
}

export type PricingHistoryParams = {
  mode?: 'range' | 'months'
  value?: number
  start_date?: string
  end_date?: string
}

function buildPricingHistoryQuery(params?: PricingHistoryParams): string {
  if (!params) return ''
  
  const query: string[] = []
  if (params.mode) query.push(`mode=${params.mode}`)
  if (params.value !== undefined) query.push(`value=${params.value}`)
  if (params.start_date) query.push(`start_date=${params.start_date}`)
  if (params.end_date) query.push(`end_date=${params.end_date}`)
  
  return query.length ? `?${query.join('&')}` : ''
}

export async function fetchPricingHistory(id: string, params?: PricingHistoryParams): Promise<PricingHistoryResponse> {
  try {
    const queryString = buildPricingHistoryQuery(params)
    const { data } = await ApiCoreClient.get<PricingHistoryResponse>(`/table/items/${id}/pricing-history/${queryString}`)
    return data
  } catch (error) {
    console.error('Error fetching pricing history:', error)
    throw error
  }
}

// Stocks By Location Types
export type LocationData = {
  name: string
  value: number
}

export type StocksByLocationResponse = {
  result: boolean
  msg: string
  data: {
    in_hand: number
    reserved: number
    allocated: number
    locations: LocationData[]
  }
}

export async function fetchStocksByLocation(id: string): Promise<StocksByLocationResponse> {
  try {
    const { data } = await ApiCoreClient.get<StocksByLocationResponse>(`/table/items/${id}/stocks-by-location/`)
    return data
  } catch (error) {
    console.error('Error fetching stocks by location:', error)
    throw error
  }
}


