import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { VendorRow } from '../types'
import { fetchVendors } from '../api'
import { useMemo, useState } from 'react'
import PillSelect from '@/shared/components/PillSelect/PillSelect'

const columns: ColumnDef<VendorRow>[] = [
  { accessorKey: 'vendor_name', header: 'Vendor' },
  { accessorKey: 'total_orders', header: 'Total Orders',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  {
    accessorKey: 'total_qty',
    header: 'Total Quantity',
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `${v.toLocaleString()} lbs`
    },
  },
  {
    accessorKey: 'total_value',
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
  const [vendor, setVendor] = useState<string>('')
  const vendors = useMemo(() => Array.from(new Set(rows.map((d) => d.name) ?? [])).sort(), [rows])
  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  if (isError) return <div className="card" style={{ padding: 16, color: 'crimson' }}>Failed to load vendors{(error as any)?.message ? `: ${(error as any).message}` : ''}</div>
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
        toolbarRight={toolbarRight}
        data={rows}
        columns={columns}
        onRowClick={(row) => navigate(`/vendors/${(row as VendorRow).id}`)}
      />
    </div>
  )
}


