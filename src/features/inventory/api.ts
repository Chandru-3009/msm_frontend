import { http } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import { InventoryRow } from './types'
import inventoryMock from '@/mocks/inventory.json'
import { InventoryDetail } from './types.detail'

export async function fetchInventory(): Promise<InventoryRow[]> {
  if (USE_MOCKS || !API_URL) {
    return inventoryMock as InventoryRow[]
  }
  try {
    const { data } = await http.get<InventoryRow[]>('/inventory')
    return Array.isArray(data) ? data : []
  } catch {
    return inventoryMock as InventoryRow[]
  }
}

export async function fetchInventoryDetail(id: string): Promise<InventoryDetail> {
  try {
    const { data } = await http.get<InventoryDetail>(`/inventory/${id}`)
    if (data?.id) return data
    throw new Error('bad data')
  } catch {
    // Fallback demo data shaped for the Stock & Sales tab
    const base = (inventoryMock as InventoryRow[]).find(r => r.id === id)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const rand = (min: number, max: number) => Math.round(min + Math.random() * (max - min))
    const pricingHistory = months.map((m, i) => ({ month: m, price: 8 + i * 0.8 + (Math.random() - 0.5) }))
    const demand = months.map((m, i) => {
      const forecast = 8000 + i * 900 + rand(-600, 600)
      return { month: m, forecast, actual: forecast + rand(-500, 500) }
    })
    let stock = base?.totalStock ?? 10000
    const stockTimeline = months.map((m, i) => {
      stock = Math.max(0, stock + rand(-3000, 4000))
      const forecastedDemand = 6000 + i * 500
      return { month: m, stock, forecastedDemand }
    })
    return {
      id,
      partNumber: base?.partNumber ?? 'Unknown',
      type: base?.type ?? 'Alloy',
      status: base?.status ?? 'Optimal',
      metrics: {
        totalStock: base?.totalStock ?? 0,
        available: base?.available ?? 0,
        allocated: base?.allocated ?? 0,
        onOrderLbs: base?.onOrderLbs ?? 0,
        reorderBy: 'Sep 24, 2025',
      },
      pricingHistory,
      demand,
      stockTimeline,
    }
  }
}


