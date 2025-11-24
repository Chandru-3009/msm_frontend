import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import StatCard from '@/shared/components/StatCard'
import { PieChartCard, LineChartCard } from '@/shared/components/Chart'
import ListCard from '@/shared/components/ListCard'
import stockIcon from '@/assets/icons/stock_icon.svg'
import cartIcon from '@/assets/icons/cart_icon.svg'
import clockIcon from '@/assets/icons/clock_icon.svg'
import PageHeader from '@/shared/components/Layout/PageHeader'
import { 
  fetchTopCustomers, 
  fetchTopVendors, 
  fetchCriticalStockItems, 
  fetchFastMovingItems, 
  fetchSlowMovingItems, 
  fetchTopQuotedItems,
  fetchHealthStatus,
  fetchInventoryByCategory,
  fetchValueTrend,
  fetchDemandVsSupply
} from '../api'


type DateRange = {
  from: string
  to: string
}

type DateRangeParams = {
  mode?: 'range' | 'months'
  value?: number
  start_date?: string
  end_date?: string
}

export default function Dashboard() {
  const [valueTrendDateRange, setValueTrendDateRange] = useState<DateRange | null>(null)
  const [demandSupplyDateRange, setDemandSupplyDateRange] = useState<DateRange | null>(null)
  const [valueTrendActiveRange, setValueTrendActiveRange] = useState<string>('3m')
  const [demandSupplyActiveRange, setDemandSupplyActiveRange] = useState<string>('3m')

  // Helper to convert range string to API params
  const getRangeParams = (range: string, customRange: DateRange | null): DateRangeParams | undefined => {
    if (customRange) {
      return {
        mode: 'range',
        start_date: customRange.from,
        end_date: customRange.to
      }
    }
    
    const monthMap: Record<string, number> = {
      '3m': 3,
      '6m': 6,
      '12m': 12,
      '18m': 18
    }
    
    if (monthMap[range]) {
      return {
        mode: 'months',
        value: monthMap[range]
      }
    }
    
    return undefined
  }

  // Fetch top customers data
  const { data: topCustomersData } = useQuery({
    queryKey: ['topCustomers'],
    queryFn: fetchTopCustomers
  })

  // Fetch top vendors data
  const { data: topVendorsData } = useQuery({
    queryKey: ['topVendors'],
    queryFn: fetchTopVendors
  })

  // Fetch inventory items data
  const { data: criticalStockData } = useQuery({
    queryKey: ['criticalStockItems'],
    queryFn: fetchCriticalStockItems
  })

  const { data: fastMovingData } = useQuery({
    queryKey: ['fastMovingItems'],
    queryFn: fetchFastMovingItems
  })

  const { data: slowMovingData } = useQuery({
    queryKey: ['slowMovingItems'],
    queryFn: fetchSlowMovingItems
  })

  const { data: topQuotedData } = useQuery({
    queryKey: ['topQuotedItems'],
    queryFn: fetchTopQuotedItems
  })

  // Fetch health status data
  const { data: healthStatusData } = useQuery({
    queryKey: ['healthStatus'],
    queryFn: fetchHealthStatus
  })

  // Fetch inventory by category data
  const { data: categoryData_API } = useQuery({
    queryKey: ['inventoryByCategory'],
    queryFn: fetchInventoryByCategory
  })

  // Fetch value trend data with date range params
  const { data: valueTrendData } = useQuery({
    queryKey: ['valueTrend', valueTrendActiveRange, valueTrendDateRange],
    queryFn: () => fetchValueTrend(getRangeParams(valueTrendActiveRange, valueTrendDateRange))
  })

  // Fetch demand vs supply data with date range params
  const { data: demandSupplyData } = useQuery({
    queryKey: ['demandVsSupply', demandSupplyActiveRange, demandSupplyDateRange],
    queryFn: () => fetchDemandVsSupply(getRangeParams(demandSupplyActiveRange, demandSupplyDateRange))
  })

  const healthData = useMemo(() => {
    if (!healthStatusData?.data) {
      return [
        { label: 'On Hand', value: 0, color: '#3B82F6' },
        { label: 'Stock Out', value: 0, color: '#EF4444' },
        { label: 'Below-Safety-Stock', value: 0, color: '#F59E0B' },
        { label: 'Excess Stock', value: 0, color: '#10B981' },
      ]
    }

    return [
      { label: 'On Hand', value: healthStatusData.data.on_hand.total_items, color: '#3B82F6' },
      { label: 'Stock Out', value: healthStatusData.data.stock_out.total_items, color: '#EF4444' },
      { label: 'Below-Safety-Stock', value: healthStatusData.data.below_safety_stock.total_items, color: '#F59E0B' },
      { label: 'Excess Stock', value: healthStatusData.data.excess_stock.total_items, color: '#10B981' },
    ]
  }, [healthStatusData])

  const categoryData = useMemo(() => {
    if (!categoryData_API?.data) {
      return [
        { label: 'Stainless Steel', value: 0, color: '#6366F1' },
        { label: 'Nickel Alloys', value: 0, color: '#F59E0B' },
        { label: 'Specialty Alloys', value: 0, color: '#EF4444' },
        { label: 'Carbon Steel', value: 0, color: '#10B981' },
        { label: 'Aluminum Alloys', value: 0, color: '#06B6D4' },
        { label: 'Copper Alloys', value: 0, color: '#A78BFA' },
        { label: 'Titanium Alloys', value: 0, color: '#F472B6' },
        { label: 'Cast Iron', value: 0, color: '#EC4899' },
      ]
    }

    return [
      { label: 'Stainless Steel', value: categoryData_API.data.stainless_steel.total_items, color: '#6366F1' },
      { label: 'Nickel Alloys', value: categoryData_API.data.nickel_alloys.total_items, color: '#F59E0B' },
      { label: 'Specialty Alloys', value: categoryData_API.data.speciality_alloys.total_items, color: '#EF4444' },
      { label: 'Carbon Steel', value: categoryData_API.data.carbon_steel.total_items, color: '#10B981' },
      { label: 'Aluminum Alloys', value: categoryData_API.data.aluminium_alloys.total_items, color: '#06B6D4' },
      { label: 'Copper Alloys', value: categoryData_API.data.copper_alloys.total_items, color: '#A78BFA' },
      { label: 'Titanium Alloys', value: categoryData_API.data.titanium_alloys.total_items, color: '#F472B6' },
      { label: 'Cast Iron', value: categoryData_API.data.cast_iron.total_items, color: '#EC4899' },
    ]
  }, [categoryData_API])

  const criticalItems = useMemo(() => {
    if (!criticalStockData?.data?.items) return []
    
    return criticalStockData.data.items.map(item => ({
      name: item.part_number,
      badge: item.product_category,
      rightPrimary: `${item.total_lbs.toLocaleString()} lbs`,
      rightSecondary: `${item.days_left} days left`
    }))
  }, [criticalStockData])

  const slowMoving = useMemo(() => {
    if (!slowMovingData?.data?.items) return []
    
    return slowMovingData.data.items.map(item => ({
      name: item.part_number,
      badge: item.product_category,
      rightPrimary: `${item.total_lbs.toLocaleString()} lbs`,
      rightSecondary: `${item.days_left} days left`
    }))
  }, [slowMovingData])

  const fastMoving = useMemo(() => {
    if (!fastMovingData?.data?.items) return []
    
    return fastMovingData.data.items.map(item => ({
      name: item.part_number,
      badge: item.product_category,
      rightPrimary: `${item.total_lbs.toLocaleString()} lbs`
    }))
  }, [fastMovingData])

  const topQuoted = useMemo(() => {
    if (!topQuotedData?.data?.items) return []
    
    return topQuotedData.data.items.map(item => ({
      name: item.part_number,
      badge: item.product_category,
      rightPrimary: `${item.total_lbs.toLocaleString()} lbs`
    }))
  }, [topQuotedData])
const topCustomers = useMemo(() => {
    if (!topCustomersData?.data?.customers) return []
    
    return topCustomersData.data.customers.map(customer => ({
      name: customer.customer_name,
      badge: `${customer.revenue_percentage}%`,
      rightPrimary: customer.number_of_orders.toString(),
      rightSecondary: customer.total_qty.toLocaleString(),
      rightTertiary: `$${customer.total_value.toLocaleString()}`
    }))
  }, [topCustomersData])

  const topVendors = useMemo(() => {
    if (!topVendorsData?.data?.vendors) return []
    
    return topVendorsData.data.vendors.map(vendor => ({
      name: vendor.vendor_name,
      badge: `${vendor.revenue_percentage}%`,
      rightPrimary: vendor.number_of_transactions.toString(),
      rightSecondary: vendor.total_qty.toLocaleString(),
      rightTertiary: `$${vendor.total_value.toLocaleString()}`
    }))
  }, [topVendorsData])

  // Helper function to extract month from period label (e.g., "Aug 2025" -> "Aug")
  const extractMonth = (periodLabel: string): string => {
    // Extract the first word (month) from labels like "Aug 2025", "Sep 2025"
    return periodLabel.split(' ')[0]
  }

  // All 12 months for default display
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const valueTrendPoints = useMemo(() => {
    // Create a map of month -> data
    const dataMap = new Map<string, { value: number; qty: number }>()
    
    if (valueTrendData?.data?.data_points) {
      valueTrendData.data.data_points.forEach(point => {
        const month = extractMonth(point.period_label)
        dataMap.set(month, {
          value: point.inventory_value,
          qty: point.quantity_lbs
        })
      })
    }
    
    // Return all 12 months with data where available, 0 otherwise
    return allMonths.map(month => ({
      label: month,
      value: dataMap.get(month)?.value || 0,
      qty: dataMap.get(month)?.qty || 0
    }))
  }, [valueTrendData])

  const demandSupplyPoints = useMemo(() => {
    // Create a map of month -> data
    const dataMap = new Map<string, { demand: number; supply: number }>()
    
    if (demandSupplyData?.data?.data_points) {
      demandSupplyData.data.data_points.forEach(point => {
        const month = extractMonth(point.period_label)
        dataMap.set(month, {
          demand: point.demand_lbs,
          supply: point.supply_lbs
        })
      })
    }
    
    // Return all 12 months with data where available, 0 otherwise
    return allMonths.map(month => ({
      label: month,
      value: dataMap.get(month)?.demand || 0,
      qty: dataMap.get(month)?.supply || 0
    }))
  }, [demandSupplyData])

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <PageHeader title="Dashboard" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
    <StatCard
        title="Total Stock"
        value={`lbs`}
        iconSrc={stockIcon}
        type="stock"
        subtext="All Products"
      />
      <StatCard
        title="Open customer Orders"
        value={`lbs`}
        iconSrc={cartIcon}
        type="customer"
        subtext="Oct 7, 2025"
      />
     
      <StatCard
        title="Stock out"
        value={`0.9 mo`}
        iconSrc={clockIcon}
        type="stockout"
        subtext="0.9 mo"
      />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <PieChartCard title="Inventory Health Status" data={healthData} />
        <PieChartCard 
          title="Inventory by Category" 
          data={categoryData} 
          totalCenterLabel={categoryData_API?.data?.total_items?.toString() || "0"} 
          legendColumns={2} 
          showvalues={false} 
        />
      </div>

   

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ListCard type="critical-stock" title="Critical Stock Items" subtitle="Preferred suppliers" items={criticalItems} />
        <ListCard type="fast-moving" title="Fast Moving Items" subtitle="High demand products" items={fastMoving} />
        <ListCard type="slow-moving" title="Slow Moving Items" subtitle="Item with low turnover" items={slowMoving} />
        <ListCard type="top-quoted" title="Top quoted items" subtitle="best performing customers" items={topQuoted} />
      </div>
      <LineChartCard
        title="Inventory Value trend"
        points={valueTrendPoints}
        yFormatter={(n) => `$${Math.round(n/1000)}k`}
        dateRange={valueTrendDateRange}
        onDateRangeChange={(range) => {
          setValueTrendDateRange(range)
          if (range) {
            setValueTrendActiveRange('')
          }
        }}
        activeRange={valueTrendActiveRange}
        onRangeChange={(range) => {
          setValueTrendActiveRange(range)
          setValueTrendDateRange(null)
        }}
      />
       <LineChartCard
        title="Demand vs Supply"
        points={demandSupplyPoints}
        yFormatter={(n) => `${Math.round(n).toLocaleString()}`}
        dateRange={demandSupplyDateRange}
        onDateRangeChange={(range) => {
          setDemandSupplyDateRange(range)
          if (range) {
            setDemandSupplyActiveRange('')
          }
        }}
        activeRange={demandSupplyActiveRange}
        onRangeChange={(range) => {
          setDemandSupplyActiveRange(range)
          setDemandSupplyDateRange(null)
        }}
        dualLine={true}
        primaryLabel="Demand (lbs)"
        secondaryLabel="Supply (lbs)"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <ListCard type="top-customers" title="Top customers" subtitle="Best performing customers" items={topCustomers} />
        <ListCard type="top-vendors" title="Top vendors" subtitle="Preferred suppliers" items={topVendors} />
      </div>
    </div>
  )
}