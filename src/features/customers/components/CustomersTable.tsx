import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { CustomerRow } from '../types'
import { fetchCustomers } from '../api'
import { useNavigate } from 'react-router-dom'
import PillSelect from '@/shared/components/PillSelect/PillSelect'
import { useMemo, useState } from 'react'

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
  const [customerType, setCustomerType] = useState<string>('')
  const rows = Array.isArray(data) ? data : []
  const customerTypes = useMemo(() => Array.from(new Set(rows.map((d) => d.name))).sort(), [rows])
  const navigate = useNavigate()

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  if (isError) return <div className="card" style={{ padding: 16, color: 'crimson' }}>Failed to load customers{(error as any)?.message ? `: ${(error as any).message}` : ''}</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8 }}>
      <PillSelect
        value={customerType}
        onChange={setCustomerType}
        options={customerTypes.map((c) => ({ value: c, label: c }))}
        placeholder="All Customers"
        allOptionLabel="All Customers"
        ariaLabel="Filter by customer"
      />
    </div>
  )

  return (
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        toolbarRight={toolbarRight}
        data={rows}
        columns={columns}
        onRowClick={(row) => navigate(`/customers/${(row as CustomerRow).id}`)}
      />
    </div>
  )
}


