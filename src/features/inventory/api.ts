import { http } from '@/shared/api/http'
import { API_URL, USE_MOCKS } from '@/shared/lib/env'
import { InventoryRow } from './types'
import inventoryMock from '@/mocks/inventory.json'

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


