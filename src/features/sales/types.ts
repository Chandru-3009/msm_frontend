export type SalesRow = {
  id: string
  date: string
  orderNo: string | number
  customer_name: string
  poNumber: string | number
  items: number
  qtyLbs: number
  orderValue: number
  deliveryStatus: 'Delivered' | 'In Transit'
}

export type   SalesMetrics = {
  data: {
    avg_order_value: string
    avg_order_value_change: string
      total_orders: string
    total_quantity_lbs: string
    total_quantity_lbs_change: string
    total_revenue: string
    total_revenue_change: string
  }
}

