import BackHeader from '@/shared/components/BackHeader/BackHeader'
import OrderItemsTable from '../components/OrderItemsTable'

export default function SalesDetailPage() {
  return (
    <>
      <BackHeader to="/sales" label="Back" />
      <OrderItemsTable />
    </>
  )
}


