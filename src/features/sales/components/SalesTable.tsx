import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { SalesRow } from '../types'
import { fetchSales } from '../api'
import { useMemo, useState } from 'react'
import downloadIcon from '@/assets/icons/download_icon.svg'
import StatCard from '@/shared/components/StatCard'
import stockIcon from '@/assets/icons/stock_icon.svg'
import cartIcon from '@/assets/icons/cart_icon.svg'
import clockIcon from '@/assets/icons/clock_icon.svg'
import StatusBadge from '@/shared/components/StatusBadge'
import PillSelect from '@/shared/components/PillSelect'
import { useNavigate } from 'react-router-dom'

const columns: ColumnDef<SalesRow>[] = [
  { accessorKey: 'date', header: 'Date', cell: (c) => {
    const v = c.getValue<string | undefined>()
    return v ? new Date(v).toLocaleDateString() : '-'
  } },
  { accessorKey: 'orderNo', header: 'Order #' },
  { accessorKey: 'customer', header: 'Customer' },
  { accessorKey: 'poNumber', header: 'PO Number' },
  { accessorKey: 'items', header: 'Items',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : v.toLocaleString()
  } },
  { accessorKey: 'qtyLbs', header: 'Qty',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'orderValue', header: 'Order Value',  cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  { accessorKey: 'deliveryStatus', header: 'Delivery Status', cell: (c) => <StatusBadge label={c.getValue<string | undefined>() ?? '-'}  radius="sm" /> },
]

export default function SalesTable() {
  const { data, isLoading } = useQuery({ queryKey: ['sales'], queryFn: fetchSales })
  const rows = Array.isArray(data) ? data : []
  const navigate = useNavigate()

  const [customer, setCustomer] = useState<string>('')
  const [deliveryStatus, setDeliveryStatus] = useState<string>('')
  const customers = useMemo(() => Array.from(new Set(rows.map((d) => d.customer))).sort(), [rows])
  const deliveryStatuses = useMemo(() => Array.from(new Set(rows.map((d) => d.deliveryStatus))).sort(), [rows])

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>

  const toolbarRight = (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <PillSelect
        value={customer}
        onChange={setCustomer}
        options={customers.map((c) => ({ value: c, label: c }))}
        placeholder="All Customers"
        allOptionLabel="All Customers"
        ariaLabel="Filter by customer"
      />
      <PillSelect
        value={deliveryStatus}
        onChange={setDeliveryStatus}
        options={deliveryStatuses.map((s) => ({ value: s, label: s }))}
        placeholder="All Delivery Status"
        allOptionLabel="All Delivery Status"
        ariaLabel="Filter by delivery status"
      />
      <button className="icon-pill" title="Download">
        <img src={downloadIcon} alt="" />
      </button>
    </div>
  )

  return (
    <>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
    <StatCard
        title="Total Stock"
        value={`lbs`}
        iconSrc={stockIcon}
        type="stock"
        linkText="All Products"
      />
      <StatCard
        title="Open customer Orders"
        value={`lbs`}
        iconSrc={cartIcon}
        type="customer"
        metaDate="Oct 7, 2025"
      />
     
      <StatCard
        title="Stock out"
        value={`0.9 mo`}
        iconSrc={clockIcon}
        type="stockout"
      />

      <StatCard
        title="Open vendor Orders"
        value={`lbs`}
        iconSrc={cartIcon}
        type="vendor"
        metaDate="Nov 28, 2025"
      />
    </div>
    <div className="card" style={{ padding: 16 }}>
      <DataTable
        data={rows}
        columns={columns}
        toolbarRight={toolbarRight}
        onRowClick={(row) => navigate(`/sales/${(row as SalesRow).id}`)}
      />
    </div>
    </>
  )
}


