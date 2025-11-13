export type VendorRow = {
  id: string
  name: string
  totalOrders: number
  totalQuantityLbs: number
  totalValueUsd: number
}

export type VendorOrderRow = {
  id: string
  date: string
  poNumber: string
  items: number
  orderValueLbs: number
  status: 'Open' | 'Delivered' | 'Processing' | 'Cancelled'
}


