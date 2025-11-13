import InlineAlert from '@/shared/components/InlineAlert'
import PurchaseAdvice from '@/shared/components/PurchaseAdvice'

export default function SalesHistoryTab() {
  return (
    <div>
      <div className="card" style={{ padding: 12 }}>
        <InlineAlert
          variant="success"
          items={[
            { label: 'Top Customer:', value: 'ABC Steel Mills (75% Orders)' },
            { label: 'Total Sales (12 Months):', value: '10,000,000 lbs' },
            { label: 'Avg Price:', value: '$13.85/lb' },
          ]}
        />
      </div>

      <div className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Quantity</h3>
        <PurchaseAdvice
          variant="neutral"
          columns={3}
          items={[
            { label: 'Last 7 days', value: '6040 lbs', trendText: '+20% than previous period', trendTone: 'up' },
            { label: 'Last 15 days', value: '9687 lbs', trendText: '0% than previous period', trendTone: 'neutral' },
            { label: 'Last 30 days', value: '10150 lbs', trendText: '-20% than previous period', trendTone: 'down' },
          ]}
        />
      </div>
    </div>
  )
}


