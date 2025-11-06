export type QuoteRow = {
  id: string
  date: string
  quoteNo: string
  customer: string
  qty: number
  price: number
  status: 'Open' | 'Won' | 'Lost'
}


