import { ApiClient } from '@/shared/api/http'
import { ForecastRow } from './types'

export type IdName = { id: number; value: string }

export type ForecastQueryParams = {
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

export type ForecastListResponse = {
  data: {
    items: ForecastRow[]
    pagination: PaginationInfo
  }
}

function buildQueryString(params: ForecastQueryParams): string {
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

export async function fetchForecast(params: ForecastQueryParams): Promise<ForecastListResponse> {
  try {
    const qs = buildQueryString(params)
    const { data } = await ApiClient.get<ForecastListResponse>(`/forecasting/table/items/${qs}`)

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

export async function fetchForecastFilterStatuses(): Promise<IdName[]> {
  const { data } = await ApiClient.get<any>('forecasting/table/filters/statuses/')
  return Array.isArray(data?.data) ? data.data as IdName[] : []
}

export async function fetchForecastFilterProductTypes(): Promise<IdName[]> {
  const { data } = await ApiClient.get<any>('/table/filters/product-types/')
  return Array.isArray(data?.data) ? data.data as IdName[] : []
}

export async function fetchForecastFilterValueRanges(): Promise<IdName[]> {
  const { data } = await ApiClient.get<any>('/table/filters/value-ranges/')
  return Array.isArray(data?.data) ? data.data as IdName[] : []
}

export async function fetchForecastFilterDaysUntilStockout(): Promise<IdName[]> {
  const { data } = await ApiClient.get<any>('/table/filters/days-until-stockout/')
  return Array.isArray(data?.data) ? data.data as IdName[] : []
}
