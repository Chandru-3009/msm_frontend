export type SalesRow = {
  id: string
  date: string
  orderNo: string | number
  customer: string
  poNumber: string | number
  items: number
  qtyLbs: number
  orderValue: number
  deliveryStatus: 'Delivered' | 'In Transit'
}


