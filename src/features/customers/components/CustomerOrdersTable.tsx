import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { CustomerOrderRow } from '../types'
import { fetchCustomerSalesHistory } from '../api'
import StatusBadge from '@/shared/components/StatusBadge'
import { useMemo, useState } from 'react'
import PillSelect from '@/shared/components/PillSelect/PillSelect'

const columns: ColumnDef<CustomerOrderRow>[] = [
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'sale_order', header: 'Sale Order' },
  { accessorKey: 'items_count', header: 'Items',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  {
    accessorKey: 'order_value_lbs',
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
  const { data, isLoading } = useQuery({
    queryKey: ['customer-sales-history', id],
    queryFn: () => fetchCustomerSalesHistory(id ?? ''),
    enabled: !!id,
  })
  const [status, setStatus] = useState<string>('')
  const statuses = useMemo(() => Array.from(new Set(data?.map((d) => d.status) ?? [])).sort(), [data])
  const rows = Array.isArray(data) ? data : []

  const filtered = useMemo(() => {
    if (!status) return rows
    return rows.filter((r) => r.status === status)
  }, [rows, status])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

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
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        loading={isLoading}
        toolbarRight={toolbarRight}
        data={filtered}
        columns={columns}
        onRowClick={(row) => navigate(`/customers/${id}/orders/${(row as CustomerOrderRow).id}`)}
      />
    </div>
  )
}


