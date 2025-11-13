import BackHeader from '@/shared/components/BackHeader/BackHeader'
import { useParams } from 'react-router-dom'
import VendorOrdersTable from '../components/VendorOrdersTable'
import { useQuery } from '@tanstack/react-query'
import { fetchVendors } from '../api'

export default function VendorOrdersPage() {
  const { id } = useParams()
  const { data: vendor } = useQuery({
    queryKey: ['vendor', id],
    queryFn: async () => {
      const list = await fetchVendors()
      return list.find((v) => v.id === (id ?? ''))
    },
    enabled: !!id,
  })
  return (
    <>
      <BackHeader to="/vendors" label={vendor?.name || 'Vendor'} />
      <VendorOrdersTable />
    </>
  )
}


