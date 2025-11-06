export type PurchaseRow = {
  id: string
  date: string
  po: string | number
  vendor: string
  customerPo: string | number
  items: number
  weightLbs: number
  eta: string
  status: 'Received' | 'In Transit' | 'Ordered'
}


