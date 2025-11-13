import { useOutletContext } from 'react-router-dom'
import stockIcon from '@/assets/icons/stock_icon.svg'
import cartIcon from '@/assets/icons/cart_icon.svg'
import calendarIcon from '@/assets/icons/calendar_icon.svg'
import clockIcon from '@/assets/icons/clock_icon.svg'
import { InventoryDetail } from '../../types.detail'
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import StatCard from '@/shared/components/StatCard'
import styles from './StockSalesTab.module.css'
import InlineAlert from '@/shared/components/InlineAlert'
import PurchaseAdvice from '@/shared/components/PurchaseAdvice'

type Ctx = { detail: InventoryDetail }

export default function StockSalesTab() {
  const { detail } = useOutletContext<Ctx>()

  return (
    <div>
      {/* Notices below tab bar */}
      <div className={styles.notices}>
        <InlineAlert
          label="Excess Stock"
          value="10,000 lbs"
          suffix="more than recommended"
          limitLabel="limit"
          limitValue="2500 lbs"
        />
        <PurchaseAdvice
          headlineAmount="25,000 lbs"
          headlineDate="Sep 24, 2025"
          vendorName="Acme Steel"
          unitPrice="$13.80/lb"
          avgOrderQty="10,000 lbs"
          avgLeadTime="45 Days"
        />
      </div>

      {/* KPI row */}
      <div className={styles.kpiGrid}>
        <StatCard
          title="Total Stock"
          value={`${detail.metrics.totalStock.toLocaleString()} lbs`}
          iconSrc={stockIcon}
          type="stock"
          linkText="All Products"
        />
        <StatCard
          title="Open customer Orders"
          value={`${detail.metrics.totalStock.toLocaleString()} lbs`}
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
          value={`${detail.metrics.onOrderLbs.toLocaleString()} lbs`}
          iconSrc={cartIcon}
          type="vendor"
          metaDate="Nov 28, 2025"
        />
        <StatCard
          title="Reorder by"
          value={detail.metrics.reorderBy || 'Sep 24, 2025'}
          iconSrc={calendarIcon}
          type="reorder"
          quantity="10000 lbs"
        />
       
      </div>

      {/* Pricing History */}
      <section className={`card ${styles.section}`}>
        <h3 className={styles.sectionTitle}>Pricing History</h3>
        <div className={styles.h220}>
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

      {/* Demand Forecast */}
      <section className={`card ${styles.sectionWithTop}`}>
        <h3 className={styles.sectionTitle}>Demand Forecast</h3>
        <div className={styles.h240}>
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
      <section className={`card ${styles.sectionWithTop}`}>
        <h3 className={styles.sectionTitle}>Stock Level Timeline</h3>
        <div className={styles.h240}>
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


