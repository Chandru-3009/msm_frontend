export type CustomerRow = {
  id: string
  name: string
  totalOrders: number
  totalQuantityLbs: number
  totalValueUsd: number
}

export type CustomerOrderRow = {
  id: string
  date: string
  salesOrder: string
  items: number
  orderValueLbs: number
  status: 'Open' | 'Delivered' | 'Processing' | 'Cancelled'
}

export type OrderItemRow = {
  id: string
  partNumber: string
  type: string
  size: string
  qtyLbs: number
  pricePerLb: number
  subtotalUsd: number
  lot: string
  deliveryDate: string
}

export type OrderSummary = {
  orderId: string
  orderNumber: string
  status: string
  date: string
  customerOrder?: string
  leadTimeDays?: number
  customerName: string
  salesPerson: string
  shipVia: string
  paymentTerms: string
  totalItems: number
  totalQuantityLbs: number
  totalValueUsd: number
  vendor?: string
  fob?: string
  freightCostUsd?: number
  expectedDelivery?: string
}


