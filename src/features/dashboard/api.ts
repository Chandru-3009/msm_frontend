import { ApiClient } from '@/shared/api/http'

export type TopCustomer = {
  customer_name: string
  revenue_percentage: number
  number_of_orders: number
  total_qty: number
  total_value: number
}

export type TopCustomersResponse = {
  success: boolean
  message: string
  data: {
    customers: TopCustomer[]
    total_count: number
    last_updated: string
  }
}

export type TopVendor = {
  vendor_name: string
  revenue_percentage: number
  number_of_transactions: number
  total_qty: number
  total_value: number
}

export type TopVendorsResponse = {
  success: boolean
  message: string
  data: {
    vendors: TopVendor[]
    total_count: number
    last_updated: string
  }
}

export async function fetchTopCustomers(): Promise<TopCustomersResponse> {
  try {
    const { data } = await ApiClient.get<TopCustomersResponse>('/dashboard/top_customers/')
    return data
  } catch (error) {
    console.error('Error fetching top customers:', error)
    throw error
  }
}

export async function fetchTopVendors(): Promise<TopVendorsResponse> {
  try {
    const { data } = await ApiClient.get<TopVendorsResponse>('/dashboard/top_vendors/')
    return data
  } catch (error) {
    console.error('Error fetching top vendors:', error)
    throw error
  }
}

export type InventoryItem = {
  part_number: string
  product_category: string
  total_lbs: number
  days_left?: number
}

export type InventoryItemsResponse = {
  success: boolean
  message: string
  data: {
    items: InventoryItem[]
    total_count: number
    last_updated: string
  }
}

export async function fetchCriticalStockItems(): Promise<InventoryItemsResponse> {
  try {
    const { data } = await ApiClient.get<InventoryItemsResponse>('/dashboard/critical_stock_items/')
    return data
  } catch (error) {
    console.error('Error fetching critical stock items:', error)
    throw error
  }
}

export async function fetchFastMovingItems(): Promise<InventoryItemsResponse> {
  try {
    const { data } = await ApiClient.get<InventoryItemsResponse>('/dashboard/fast_moving_items/')
    return data
  } catch (error) {
    console.error('Error fetching fast moving items:', error)
    throw error
  }
}

export async function fetchSlowMovingItems(): Promise<InventoryItemsResponse> {
  try {
    const { data } = await ApiClient.get<InventoryItemsResponse>('/dashboard/slow_moving_items/')
    return data
  } catch (error) {
    console.error('Error fetching slow moving items:', error)
    throw error
  }
}

export async function fetchTopQuotedItems(): Promise<InventoryItemsResponse> {
  try {
    const { data } = await ApiClient.get<InventoryItemsResponse>('/dashboard/top_quoted_items/')
    return data
  } catch (error) {
    console.error('Error fetching top quoted items:', error)
    throw error
  }
}

export type HealthStatusCategory = {
  total_items: number
  total_item_percentage: number
}

export type HealthStatusResponse = {
  success: boolean
  message: string
  data: {
    on_hand: HealthStatusCategory
    stock_out: HealthStatusCategory
    below_safety_stock: HealthStatusCategory
    excess_stock: HealthStatusCategory
    total_items: number
    last_updated: string
  }
}

export async function fetchHealthStatus(): Promise<HealthStatusResponse> {
  try {
    const { data } = await ApiClient.get<HealthStatusResponse>('/dashboard/health_status/')
    return data
  } catch (error) {
    console.error('Error fetching health status:', error)
    throw error
  }
}

export type CategoryItem = {
  total_items: number
  total_item_percentage: number
}

export type CategoryResponse = {
  success: boolean
  message: string
  data: {
    stainless_steel: CategoryItem
    aluminium_alloys: CategoryItem
    nickel_alloys: CategoryItem
    copper_alloys: CategoryItem
    speciality_alloys: CategoryItem
    titanium_alloys: CategoryItem
    carbon_steel: CategoryItem
    cast_iron: CategoryItem
    total_items: number
    last_updated: string
  }
}

export async function fetchInventoryByCategory(): Promise<CategoryResponse> {
  try {
    const { data } = await ApiClient.get<CategoryResponse>('/dashboard/by_category/')
    return data
  } catch (error) {
    console.error('Error fetching inventory by category:', error)
    throw error
  }
}

export type TrendDataPoint = {
  period_label: string
  start_date: string
  end_date: string
  inventory_value: number
  quantity_lbs: number
}

export type ValueTrendResponse = {
  success: boolean
  message: string
  data: {
    metadata: {
      selected_range: {
        mode: string
        value: number
        start_date: string
        end_date: string
      }
      interval_type: string
      currency: string
    }
    data_points: TrendDataPoint[]
  }
}

export type DemandSupplyDataPoint = {
  period_label: string
  start_date: string
  end_date: string
  demand_lbs: number
  supply_lbs: number
}

export type DemandSupplyResponse = {
  success: boolean
  message: string
  data: {
    metadata: {
      selected_range: {
        mode: string
        value: number
        start_date: string
        end_date: string
      }
      interval_type: string
      unit: string
    }
    data_points: DemandSupplyDataPoint[]
  }
}

export type DateRangeParams = {
  mode?: 'range' | 'months'
  value?: number
  start_date?: string
  end_date?: string
}

function buildDateRangeQuery(params?: DateRangeParams): string {
  if (!params) return ''
  
  const query: string[] = []
  if (params.mode) query.push(`mode=${params.mode}`)
  if (params.value !== undefined) query.push(`value=${params.value}`)
  if (params.start_date) query.push(`start_date=${params.start_date}`)
  if (params.end_date) query.push(`end_date=${params.end_date}`)
  
  return query.length ? `?${query.join('&')}` : ''
}

export async function fetchValueTrend(params?: DateRangeParams): Promise<ValueTrendResponse> {
  try {
    const queryString = buildDateRangeQuery(params)
    const { data } = await ApiClient.get<ValueTrendResponse>(`/dashboard/value_trend/${queryString}`)
    return data
  } catch (error) {
    console.error('Error fetching value trend:', error)
    throw error
  }
}

export async function fetchDemandVsSupply(params?: DateRangeParams): Promise<DemandSupplyResponse> {
  try {
    const queryString = buildDateRangeQuery(params)
    const { data } = await ApiClient.get<DemandSupplyResponse>(`/dashboard/demand_vs_supply/${queryString}`)
    return data
  } catch (error) {
    console.error('Error fetching demand vs supply:', error)
    throw error
  }
}

