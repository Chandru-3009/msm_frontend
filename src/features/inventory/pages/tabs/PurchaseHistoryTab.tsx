import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchPurchaseHistory } from '../../api'
import InlineAlert from '@/shared/components/InlineAlert'
import PurchaseAdvice from '@/shared/components/PurchaseAdvice'
import DataTable from '@/shared/components/DataTable/DataTable'

export default function PurchaseHistoryTab() {
  const { id = '' } = useParams()
  
  const { data, isLoading } = useQuery({
    queryKey: ['purchase-history', id],
    queryFn: () => fetchPurchaseHistory(id),
    enabled: !!id,
  })

  if (isLoading) return <div>Loading purchase history...</div>

  const stats = data?.data?.stats
  const history7Days = data?.data?.last_7_days_purchase_history
  const history15Days = data?.data?.last_15_days_purchase_history
  const history30Days = data?.data?.last_30_days_purchase_history
  const items = data?.data?.items || []

  return (
    <div>
      <div className="card" style={{ padding: 12 }}>
        <InlineAlert
          variant="success"
          items={[
            { label: 'Top Vendor:', value: `${stats?.top_vendor_name || 'N/A'} (${stats?.top_vendor_order_count_percentage || 0}% Orders)` },
            { label: 'Total Purchases (12 Months):', value: `${(stats?.total_purchases_in_12_months || 0).toLocaleString()} lbs` },
            { label: 'Avg Cost:', value: `$${(stats?.avg_cost_per_lb || 0).toFixed(2)}/lb` },
          ]}
        />
      </div>

      <div className="card" style={{ padding: 12, marginTop: 12, marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>Quantity</h3>
        <PurchaseAdvice
          variant="neutral"
          columns={3}
          items={[
            { 
              label: 'Last 7 days', 
              value: `${history7Days?.qty || 0} lbs`, 
              trendText: `${Math.abs(history7Days?.percentage_change || 0).toFixed(2)}% than previous period`, 
              trendTone: history7Days?.trend === 'increased' ? 'up' : history7Days?.trend === 'decreased' ? 'down' : 'neutral' 
            },
            { 
              label: 'Last 15 days', 
              value: `${history15Days?.qty || 0} lbs`, 
              trendText: `${Math.abs(history15Days?.percentage_change || 0).toFixed(2)}% than previous period`, 
              trendTone: history15Days?.trend === 'increased' ? 'up' : history15Days?.trend === 'decreased' ? 'down' : 'neutral' 
            },
            { 
              label: 'Last 30 days', 
              value: `${history30Days?.qty || 0} lbs`, 
              trendText: `${Math.abs(history30Days?.percentage_change || 0).toFixed(2)}% than previous period`, 
              trendTone: history30Days?.trend === 'increased' ? 'up' : history30Days?.trend === 'decreased' ? 'down' : 'neutral' 
            },
          ]}
        />
      </div>
      <DataTable
        enableGlobalFilter={false}
        data={items}
        columns={[
          { accessorKey: 'order_date', header: 'Date' },
          { accessorKey: 'vendor_name', header: 'Vendor' },
          { accessorKey: 'qty', header: 'Quantity (lbs)', cell: ({ row }) => row.original.qty.toLocaleString() },
          { accessorKey: 'cost_per_unit', header: 'Cost/Unit', cell: ({ row }) => `$${row.original.cost_per_unit.toFixed(2)}` },
          { accessorKey: 'order_value', header: 'Order Value', cell: ({ row }) => `$${row.original.order_value.toLocaleString()}` },
        ]}
      />
    </div>
  )
}


