import CustomerOrdersTable from '../components/CustomerOrdersTable'
import { useParams } from 'react-router-dom'
import BackHeader from '@/shared/components/BackHeader/BackHeader'

export default function CustomerOrdersPage() {
  const { id } = useParams()
  
  return (
    <>
      <BackHeader to="/customers" label="Customer Sales History" />
      <CustomerOrdersTable />
    </>
  )
}


