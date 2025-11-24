import DataTable from '@/shared/components/DataTable/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { OrderItemRow } from '../types'
import { fetchPurchaseOrderItems } from '@/features/purchase/api'
import OrderSummaryHeader from './OrderSummary'

const columns: ColumnDef<OrderItemRow>[] = [
  { accessorKey: 'partNumber', header: 'Part Number' },
  { accessorKey: 'grade', header: 'Grade' },
  { accessorKey: 'size', header: 'Size' },
  { accessorKey: 'ordered_qty_lbs', header: 'Ordered', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  
  { accessorKey: 'received_qty_lbs', header: 'Received', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `${v.toLocaleString()} lbs`
  } },
  { accessorKey: 'unit_price_per_lb', header: 'Price/lb', meta: { align: 'right' as const }, cell: (c) => {
    const v = c.getValue<number | undefined>()
    return v == null ? '-' : `$${v.toLocaleString()}`
  } },
  {
    accessorKey: 'subtotalUsd',
    header: 'Subtotal',
    meta: { align: 'right' as const },
    cell: (c) => {
      const v = c.getValue<number | undefined>()
      return v == null ? '-' : `$${v.toLocaleString()}`
    },
  },
  { accessorKey: 'expected_ship_date', header: 'Expected Ship Date' },
]

export default function OrderItemsTable() {
  const { orderId } = useParams()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['purchase-order-items', orderId],
    queryFn: () => fetchPurchaseOrderItems(orderId ?? ''),
    enabled: !!orderId,
  })

  if (isLoading) return <div className="card" style={{ padding: 16 }}>Loading…</div>
  if (isError) return <div className="card" style={{ padding: 16, color: 'crimson' }}>Failed to load order{(error as any)?.message ? `: ${(error as any).message}` : ''}</div>

  const items = data?.items ?? []
  const summary = data?.summary

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {summary && <OrderSummaryHeader data={summary} />}
      <div className="card" style={{ padding: 16 }}>
        <DataTable enablePagination={false} enableGlobalFilter={false} data={items} columns={columns} />
      </div>
    </div>
  )
}


