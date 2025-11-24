export type CustomerRow = {
  id: string
  customer_name: string
  total_orders: number
  total_qty: number
  total_value: number
}

export type CustomerOrderRow = {
  id: string
  date: string
  sales_order: string
  items: number
  order_value_lbs: number
  status: string
}

export type OrderItemRow = {
  id: string
  partNumber: string
  type?: string
  size: string
  qtyLbs?: number
  pricePerLb?: number
  subtotalUsd: number
  lot?: string
  deliveryDate?: string
  grade?: string
  ordered_qty_lbs?: number
  received_qty_lbs?: number
  unit_price_per_lb?: number
  expected_ship_date?: string
}

export type OrderSummary = {
  items: OrderItemRow[]
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


