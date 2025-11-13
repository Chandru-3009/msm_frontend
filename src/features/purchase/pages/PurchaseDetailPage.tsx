import BackHeader from '@/shared/components/BackHeader/BackHeader'
import OrderItemsTable from '../components/OrderItemsTable'

export default function PurchaseDetailPage() {
  return (
    <>
      <BackHeader to="/purchase" label="Back" />
      <OrderItemsTable />
    </>
  )
}


