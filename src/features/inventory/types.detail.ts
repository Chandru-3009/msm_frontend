export type InventoryDetail = {
  id: string
  partNumber: string
  type: string
  status: 'Critical' | 'Low' | 'Optimal'
  metrics: {
    totalStock: number
    available: number
    allocated: number
    onOrderLbs: number
    reorderBy?: string
  }
  pricingHistory: { month: string; price: number }[]
  demand: { month: string; forecast: number; actual: number }[]
  stockTimeline: { month: string; stock: number; forecastedDemand: number }[]
}


