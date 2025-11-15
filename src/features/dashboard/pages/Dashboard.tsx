import React, { useMemo } from 'react'
import StatCard from '@/shared/components/StatCard'
import { PieChartCard, LineChartCard } from '@/shared/components/Chart'
import ListCard from '@/shared/components/ListCard'
import stockIcon from '@/assets/icons/stock_icon.svg'
import cartIcon from '@/assets/icons/cart_icon.svg'
import clockIcon from '@/assets/icons/clock_icon.svg'
import PageHeader from '@/shared/components/Layout/PageHeader'


export default function Dashboard() {
 

  const healthData = useMemo(() => [
    { label: 'On Hand', value: 850, color: '#3B82F6' },
    { label: 'Stock Out', value: 230, color: '#EF4444' },
    { label: 'Below-Safety-Stock', value: 120, color: '#F59E0B' },
    { label: 'Excess Stock', value: 350, color: '#10B981' },
  ], [])

  const categoryData = useMemo(() => [
    { label: 'Stainless Steel', value: 293, color: '#6366F1' },
    { label: 'Nickel Alloys', value: 210, color: '#F59E0B' },
    { label: 'Specialty Alloys', value: 180, color: '#EF4444' },
    { label: 'Carbon Steel', value: 160, color: '#10B981' },
    { label: 'Aluminum Alloys', value: 120, color: '#06B6D4' },
    { label: 'Copper Alloys', value: 95, color: '#A78BFA' },
    { label: 'Titanium Alloys', value: 75, color: '#F472B6' },
  ], [])

  const criticalItems = [
    { name: '2.500400BRHF', badge: 'Stainless Steel',  rightPrimary: '450 lbs', rightSecondary: '8 days left' },
    { name: '2.500400BRHF', badge: 'Aluminum', rightPrimary: '420 lbs', rightSecondary: '12 days left' },
    { name: '1.750400BRHF', badge: 'Nickel Alloys', rightPrimary: '380 lbs', rightSecondary: '15 days left' },
    { name: '1.000400BRHF', badge: 'Carbon Steel', rightPrimary: '470 lbs', rightSecondary: '18 days left' },
    { name: '0.625400BRHF', badge: 'Titanium Alloys', rightPrimary: '230 lbs', rightSecondary: '20 days left' },
  ]

  const slowMoving = [
    { name: '2.500400BRHF', badge: 'Stainless Steel',  rightPrimary: '450 lbs', rightSecondary: '8 days left' },
    { name: '2.500400BRHF', badge: 'Aluminum', rightPrimary: '420 lbs', rightSecondary: '12 days left' },
    { name: '1.750400BRHF', badge: 'Nickel Alloys', rightPrimary: '380 lbs', rightSecondary: '15 days left' },
    { name: '1.000400BRHF', badge: 'Carbon Steel', rightPrimary: '470 lbs', rightSecondary: '18 days left' },
    { name: '0.625400BRHF', badge: 'Titanium Alloys', rightPrimary: '230 lbs', rightSecondary: '20 days left' },
  ]

  const fastMoving = [
    { name: '4.338000HRB', badge: 'Specialty Alloys', rightPrimary: '1200 lbs',  },
    { name: '4.338000HTRB', badge: 'Copper Alloys', rightPrimary: '980 lbs',  },
    { name: '2.500400BRHF', badge: 'Cast Iron', rightPrimary: '860 lbs',  },
    { name: '1.750400BRHF', badge: 'Nickel Alloys', rightPrimary: '720 lbs',  },
    { name: '1.000400BRHF', badge: 'Aluminum', rightPrimary: '520 lbs', },
  ]
  const topQuoted = [
    { name: '4.338000HRB', badge: 'Specialty Alloys', rightPrimary: '1200 lbs',  },
    { name: '4.338000HTRB', badge: 'Copper Alloys', rightPrimary: '980 lbs',  },
    { name: '2.500400BRHF', badge: 'Cast Iron', rightPrimary: '860 lbs',  },
    { name: '1.750400BRHF', badge: 'Nickel Alloys', rightPrimary: '720 lbs',  },
    { name: '1.000400BRHF', badge: 'Aluminum', rightPrimary: '520 lbs', },
  ]
const topCustomers = [
    { name: '85%', badge: 'Specialty Alloys', rightPrimary: '1200', rightSecondary: '12000', rightTertiary: '120000' },
    { name: '75%', badge: 'Copper Alloys', rightPrimary: '980', rightSecondary: '9800', rightTertiary: '98000' },
    { name: '65%', badge: 'Cast Iron', rightPrimary: '860', rightSecondary: '8600', rightTertiary: '86000' },
    { name: '55%', badge: 'Nickel Alloys', rightPrimary: '720', rightSecondary: '7200', rightTertiary: '72000' },
    { name: '45%', badge: 'Aluminum', rightPrimary: '520', rightSecondary: '5200', rightTertiary: '52000' },
  ]
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageHeader title="Dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
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
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <PieChartCard title="Inventory Health Status" data={healthData} />
        <PieChartCard title="Inventory by Category" data={categoryData} totalCenterLabel="1508" legendColumns={2} showvalues={false} />
      </div>

   

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ListCard type="critical-stock" title="Critical Stock Items" subtitle="Preferred suppliers" items={criticalItems} />
        <ListCard type="fast-moving" title="Fast Moving Items" subtitle="High demand products" items={fastMoving} />
        <ListCard type="slow-moving" title="Slow Moving Items" subtitle="Item with low turnover" items={slowMoving} />
        <ListCard type="top-quoted" title="Top quoted items" subtitle="best performing customers" items={topQuoted} />
      </div>
      <LineChartCard
        title="Inventory Value trend"
        points={[
          { label: 'Jan', value: 140000, qty: 50000 },
          { label: 'Feb', value: 135000, qty: 48000 },
          { label: 'Mar', value: 175000, qty: 52000 },
          { label: 'Apr', value: 168000, qty: 51000 },
          { label: 'May', value: 205000, qty: 53000 },
          { label: 'Jun', value: 198000, qty: 50000 },
          { label: 'Jul', value: 192000, qty: 49500 },
          { label: 'Aug', value: 196000, qty: 50500 },
          { label: 'Sep', value: 205000, qty: 52000 },
          { label: 'Oct', value: 198000, qty: 51000 },
          { label: 'Nov', value: 186000, qty: 49500 },
          { label: 'Dec', value: 160000, qty: 46000 },
        ]}
        yFormatter={(n) => `$${Math.round(n/1000)}k`}
      />
       <LineChartCard
        title="Inventory Value trend"
        points={[
          { label: 'Jan', value: 140000, qty: 50000 },
          { label: 'Feb', value: 135000, qty: 48000 },
          { label: 'Mar', value: 175000, qty: 52000 },
          { label: 'Apr', value: 168000, qty: 51000 },
          { label: 'May', value: 205000, qty: 53000 },
          { label: 'Jun', value: 198000, qty: 50000 },
          { label: 'Jul', value: 192000, qty: 49500 },
          { label: 'Aug', value: 196000, qty: 50500 },
          { label: 'Sep', value: 205000, qty: 52000 },
          { label: 'Oct', value: 198000, qty: 51000 },
          { label: 'Nov', value: 186000, qty: 49500 },
          { label: 'Dec', value: 160000, qty: 46000 },
        ]}
        yFormatter={(n) => `$${Math.round(n/1000)}k`}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ListCard type="top-customers" title="Top customers" subtitle="Best performing customers" items={topCustomers} />
        <ListCard type="top-vendors" title="Top vendors" subtitle="Preferred suppliers" items={topCustomers} />
      </div>
    </div>
  )
}