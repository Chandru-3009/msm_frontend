import BackHeader from '@/shared/components/BackHeader/BackHeader'
import OrderItemsTable from '../components/OrderItemsTable'
import { useParams } from 'react-router-dom'

export default function OrderDetailPage() {
  const { id } = useParams()
  return (
    <>
      <BackHeader to={`/vendors/${id}`} label="Back" />
      <OrderItemsTable />
    </>
  )
}


