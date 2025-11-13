import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { VendorRow } from '../types'
import { fetchVendors } from '../api'

const columns: ColumnDef<VendorRow>[] = [
  { accessorKey: 'name', header: 'Vendor' },
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

export default function VendorsTable() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['vendors'], queryFn: fetchVendors })
  const rows = Array.isArray(data) ? data : []
  const navigate = useNavigate()

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  if (isError) return <div className="card" style={{ padding: 16, color: 'crimson' }}>Failed to load vendors{(error as any)?.message ? `: ${(error as any).message}` : ''}</div>

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        data={rows}
        columns={columns}
        onRowClick={(row) => navigate(`/vendors/${(row as VendorRow).id}`)}
      />
    </div>
  )
}


