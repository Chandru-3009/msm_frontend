export type ForecastRow = {
  id: string
  partNumber: string
  type: string
  size: string
  stock: number
  available: number
  forecastLbs: number
  nextReorder: string
  daysUntilStockout: number
  status: 'Critical' | 'Low' | 'Optimal'
}


