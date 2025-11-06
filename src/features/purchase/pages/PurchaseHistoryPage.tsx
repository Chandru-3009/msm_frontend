import PageHeader from '@/shared/components/Layout/PageHeader'
import PurchaseTable from '../components/PurchaseTable'

export default function PurchaseHistoryPage() {
  return (
    <div>
      <PageHeader title="Purchase History" />
      <PurchaseTable />
    </div>
  )
}


