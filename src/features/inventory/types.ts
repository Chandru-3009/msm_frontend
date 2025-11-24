export type InventoryRow = {
  id: string
  partNumber: string
  type: string
  totalStock: number
  available: number
  allocated: number
  onOrderLbs: number
  unitPrice: number
  totalValue: number
  daysUntilStockout: number
  status: 'Critical' | 'Low' | 'Optimal' | 'Excess'
}


