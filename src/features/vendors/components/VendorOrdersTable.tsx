import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { VendorOrderRow } from '../types'
import { fetchVendorOrders } from '../api'
import StatusBadge from '@/shared/components/StatusBadge'
import PillSelect from '@/shared/components/PillSelect/PillSelect'
import { useMemo } from 'react'
import { useState } from 'react'
import Filters from '@/shared/components/Filters/Filters'

const columns: ColumnDef<VendorOrderRow>[] = [
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'purchase_order', header: 'PO Number' },
  { accessorKey: 'items_count', header: 'Items',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  {
    accessorKey: 'order_value_display',
    header: 'Order Value',  
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `${v.toLocaleString()} lbs`
    },
  },
  { accessorKey: 'status', header: 'Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
]

export default function VendorOrdersTable() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vendor-orders', id],
    queryFn: () => fetchVendorOrders(id ?? ''),
    enabled: !!id,
  })
  const rows = Array.isArray(data) ? data : []
  const [status, setStatus] = useState<string>('')
  const statuses = useMemo(() => Array.from(new Set(rows.map((d) => d.status) ?? [])).sort(), [rows])
  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  if (isError) return <div className="card" style={{ padding: 16, color: 'crimson' }}>Failed to load orders{(error as any)?.message ? `: ${(error as any).message}` : ''}</div>
  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <PillSelect
        value={status}
        onChange={setStatus}
        options={statuses.map((s) => ({ value: s, label: s }))}
        placeholder="All Status"
        allOptionLabel="All Status"
        ariaLabel="Filter by status"
      />
      <Filters
        typeOptions={[]}
        valueRanges={[]}
        daysOptions={[]}
        value={{ types: [] }}
        onChange={() => {}}
      />
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        toolbarRight={toolbarRight}
        data={rows}
        columns={columns}
        onRowClick={(row) => navigate(`/vendors/${id}/orders/${(row as VendorOrderRow).id}`)}
      />
    </div>
  )
}


