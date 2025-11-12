import { useOutletContext } from 'react-router-dom'
import { InventoryDetail } from '../../types.detail'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import StatCard from '@/shared/components/StatCard'

type Ctx = { detail: InventoryDetail }

export default function StockSalesTab() {
  const { detail } = useOutletContext<Ctx>()

  return (
    <div>
      {/* Pricing History */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginTop: 12 }}>
        <StatCard
          title="Total Stock"
          value={`${detail.metrics.totalStock.toLocaleString()} lbs`}
          actionLabel="All Products"
          actionHref="#"
        />
        <StatCard
          title="Open Vendor Orders"
          value={`${detail.metrics.onOrderLbs.toLocaleString()} lbs`}
        />
        <StatCard
          title="Allocated"
          value={`${detail.metrics.allocated.toLocaleString()} lbs`}
        />
         <StatCard
          title="Open Vendor Orders"
          value={`${detail.metrics.onOrderLbs.toLocaleString()} lbs`}
        />
        <StatCard
          title="Allocated"
          value={`${detail.metrics.allocated.toLocaleString()} lbs`}
        />
      </div>
      <section className="card" style={{ padding: 12 }}>
        <h3 style={{ marginTop: 0 }}>Pricing History</h3>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={detail.pricingHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: any) => [`$${Number(v).toFixed(2)}`, 'Avg Price']} />
              <Line dataKey="price" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* KPI row */}
     

      {/* Demand Forecast */}
      <section className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Demand Forecast</h3>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={detail.demand}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="forecast" stroke="#ef4444" fill="#fecaca" />
              <Area type="monotone" dataKey="actual" stroke="#2563eb" fill="#bfdbfe" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Stock Level Timeline */}
      <section className="card" style={{ padding: 12, marginTop: 12 }}>
        <h3 style={{ marginTop: 0 }}>Stock Level Timeline</h3>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={detail.stockTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="stock" stroke="#2563eb" fill="#bfdbfe" />
              <Area type="monotone" dataKey="forecastedDemand" stroke="#ef4444" fill="#fecaca" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}


