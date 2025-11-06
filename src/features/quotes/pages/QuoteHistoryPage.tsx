import QuotesTable from '../components/QuotesTable'
import PageHeader from '@/shared/components/Layout/PageHeader'

export default function QuoteHistoryPage() {
  return (
    <div>
      <PageHeader title="Quote History" />
      <QuotesTable />
    </div>
  )
}


