import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { CustomerRow } from '../types'
import { fetchCustomers } from '../api'
import { useNavigate } from 'react-router-dom'

const columns: ColumnDef<CustomerRow>[] = [
  { accessorKey: 'name', header: 'Customer' },
  { accessorKey: 'totalOrders', header: 'Total Orders',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  {
    accessorKey: 'totalQuantityLbs',
    header: 'Total Quantity',
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `${v.toLocaleString()} lbs`
    },
  },
  {
    accessorKey: 'totalValueUsd',
    header: 'Total Value',
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `$${v.toLocaleString()}`
    },
  },
]

export default function CustomersTable() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['customers'], queryFn: fetchCustomers })
  const rows = Array.isArray(data) ? data : []
  const navigate = useNavigate()

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  if (isError) return <div className="card" style={{ padding: 16, color: 'crimson' }}>Failed to load customers{(error as any)?.message ? `: ${(error as any).message}` : ''}</div>

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        data={rows}
        columns={columns}
        onRowClick={(row) => navigate(`/customers/${(row as CustomerRow).id}`)}
      />
    </div>
  )
}


