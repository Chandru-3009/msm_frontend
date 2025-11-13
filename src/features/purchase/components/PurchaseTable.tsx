import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { fetchPurchases } from '../api'
import { PurchaseRow } from '../types'
import { useMemo, useState } from 'react'
import StatusBadge from '@/shared/components/StatusBadge'
import PillSelect from '@/shared/components/PillSelect'
import { useNavigate } from 'react-router-dom'

const columns: ColumnDef<PurchaseRow>[] = [
  { accessorKey: 'date', header: 'Date', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'po', header: 'PO#' },
  { accessorKey: 'vendor', header: 'Vendor' },
  { accessorKey: 'customerPo', header: 'Customer PO' },
  { accessorKey: 'items', header: 'Items',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'weightLbs', header: 'Weight',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'eta', header: 'ETA', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'status', header: 'Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
]

export default function PurchaseTable() {
  const { data, isLoading } = useQuery({ queryKey: ['purchases'], queryFn: fetchPurchases })

  const rows = Array.isArray(data) ? data : []
  const navigate = useNavigate()

  const [vendor, setVendor] = useState<string>('')
  const vendors = useMemo(() => Array.from(new Set(rows.map((d) => d.vendor))).sort(), [rows])



  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <PillSelect
        value={vendor}
        onChange={setVendor}
        options={vendors.map((v) => ({ value: v, label: v }))}
        placeholder="All Vendors"
        allOptionLabel="All Vendors"
        ariaLabel="Filter by vendor"
      />
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        data={rows}
        columns={columns}
        toolbarRight={toolbarRight}
        searchPlaceholder="Search"
        onRowClick={(row) => navigate(`/purchase/${(row as PurchaseRow).po}`)}
      />
    </div>
  )
}


