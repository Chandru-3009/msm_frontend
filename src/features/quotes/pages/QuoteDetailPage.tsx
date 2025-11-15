import BackHeader from '@/shared/components/BackHeader/BackHeader'
import QuoteItemsTable from '../components/QuoteItemsTable'

export default function QuoteDetailPage() {
  return (
    <>
      <BackHeader to="/quotes" label="Back" />
      <QuoteItemsTable />
    </>
  )
}


