import PageHeader from '@/shared/components/Layout/PageHeader'
import OrderItemsTable from '../components/OrderItemsTable'
import { useParams } from 'react-router-dom'
import BackHeader from '@/shared/components/BackHeader/BackHeader'

export default function OrderDetailPage() {
  const { id } = useParams()
  return (
    <>
      <BackHeader to={`/customers/${id}`} label="Back" />
      <OrderItemsTable />
    </>
  )
}


