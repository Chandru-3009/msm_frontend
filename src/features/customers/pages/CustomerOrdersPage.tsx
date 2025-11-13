import PageHeader from '@/shared/components/Layout/PageHeader'
import CustomerOrdersTable from '../components/CustomerOrdersTable'
import { useParams } from 'react-router-dom'
import BackHeader from '@/shared/components/BackHeader/BackHeader'
import { useQuery } from '@tanstack/react-query'
import { fetchCustomers } from '../api'

export default function CustomerOrdersPage() {
  const { id } = useParams()
  const { data: customer } = useQuery({
    queryKey: ['customer', id],
    queryFn: async () => {
      const list = await fetchCustomers()
      return list.find((c) => c.id === (id ?? ''))
    },
    enabled: !!id,
  })
  return (
    <>
      <BackHeader to="/customers" label={customer?.name || 'Customer'} />
      <CustomerOrdersTable />
    </>
  )
}


