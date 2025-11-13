import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { CustomerOrderRow } from '../types'
import { fetchCustomerOrders } from '../api'
import StatusBadge from '@/shared/components/StatusBadge'

const columns: ColumnDef<CustomerOrderRow>[] = [
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'salesOrder', header: 'Sale Order' },
  { accessorKey: 'items', header: 'Items',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  {
    accessorKey: 'orderValueLbs',
    header: 'Order Value',
    cell: (c) => {  
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `${v.toLocaleString()} lbs`
    },
  },
  { accessorKey: 'status', header: 'Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
]

export default function CustomerOrdersTable() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['customer-orders', id],
    queryFn: () => fetchCustomerOrders(id ?? ''),
    enabled: !!id,
  })
  const rows = Array.isArray(data) ? data : []

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  if (isError) return <div className="card" style={{ padding: 16, color: 'crimson' }}>Failed to load orders{(error as any)?.message ? `: ${(error as any).message}` : ''}</div>

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        data={rows}
        columns={columns}
        onRowClick={(row) => navigate(`/customers/${id}/orders/${(row as CustomerOrderRow).id}`)}
      />
    </div>
  )
}


