import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { fetchStockStatus, fetchPricingHistory, fetchStocksByLocation, type PricingHistoryParams } from '../../api'
import stockIcon from '@/assets/icons/stock_icon.svg'
import cartIcon from '@/assets/icons/cart_icon.svg'
import calendarIcon from '@/assets/icons/calendar_icon.svg'
import clockIcon from '@/assets/icons/clock_icon.svg'
import StatCard from '@/shared/components/StatCard'
import styles from './StockSalesTab.module.css'
import InlineAlert from '@/shared/components/InlineAlert'
import PurchaseAdvice from '@/shared/components/PurchaseAdvice'
import LineChartCard from '@/shared/components/Chart/LineChartCard'
import BarChartCard from '@/shared/components/Chart/BarChartCard'

type DateRange = {
  from: string
  to: string
}

export default function StockSalesTab() {
  const { id = '' } = useParams()
  const [pricingDateRange, setPricingDateRange] = useState<DateRange | null>(null)
  const [pricingActiveRange, setPricingActiveRange] = useState<string>('12m')
  
  const { data, isLoading } = useQuery({
    queryKey: ['stock-status', id],
    queryFn: () => fetchStockStatus(id),
    enabled: !!id
  })

  // Helper to convert range string to API params
  const getPricingRangeParams = (range: string, customRange: DateRange | null): PricingHistoryParams | undefined => {
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

  // Fetch pricing history
  const { data: pricingHistoryData } = useQuery({
    queryKey: ['pricing-history', id, pricingActiveRange, pricingDateRange],
    queryFn: () => fetchPricingHistory(id, getPricingRangeParams(pricingActiveRange, pricingDateRange)),
    enabled: !!id
  })

  // Fetch stocks by location
  const { data: stocksByLocationData } = useQuery({
    queryKey: ['stocks-by-location', id],
    queryFn: () => fetchStocksByLocation(id),
    enabled: !!id
  })

  // Helper to extract month from "Jun 2025" format
  const extractMonth = (dateStr: string): string => {
    return dateStr.split(' ')[0]
  }

  // Transform pricing history data to show all 12 months
  const pricingHistoryPoints = useMemo(() => {
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dataMap = new Map<string, { value: number; vendor?: string; qty?: number; total?: number }>()
    
    if (pricingHistoryData?.data?.pricing_data) {
      pricingHistoryData.data.pricing_data.forEach(point => {
        const month = extractMonth(point.name)
        dataMap.set(month, {
          value: point.value,
          vendor: point.vendor,
          qty: point.Quantity,
          total: point.Total
        })
      })
    }
    
    return allMonths.map(month => ({
      label: month,
      value: dataMap.get(month)?.value || 0,
      vendor: dataMap.get(month)?.vendor,
      qty: dataMap.get(month)?.qty,
      total: dataMap.get(month)?.total
    }))
  }, [pricingHistoryData])

  // Transform stocks by location data to include Reserved and Allocated bars
  const stocksByLocationBars = useMemo(() => {
    const bars = stocksByLocationData?.data?.locations.map(loc => ({
      label: loc.name,
      value: loc.value,
      color: '#3B82F6' // Blue for locations
    })) || []

    // Add Reserved and Allocated bars at the end
    if (stocksByLocationData?.data) {
      if (stocksByLocationData.data.reserved > 0) {
        bars.push({
          label: 'Reserved',
          value: stocksByLocationData.data.reserved,
          color: '#F59E0B' // Orange for Reserved
        })
      }
      if (stocksByLocationData.data.allocated > 0) {
        bars.push({
          label: 'Allocated',
          value: stocksByLocationData.data.allocated,
          color: '#10B981' // Green for Allocated
        })
      }
    }

    return bars
  }, [stocksByLocationData])

  // Mock data for other graphs (will be replaced with real API later)
 

  if (isLoading || !data?.data) return <div>Loading stock status...</div>

  const apiData = data.data
  const productSummary = apiData.product_summary
  const stockStatus = apiData.stock_status
  const purchaseRec = apiData.purchase_recommendation
  const vendorInfo = apiData.vendor_information?.primary_vendor

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
          headlineAmount={`${purchaseRec?.recommended_quantity?.toLocaleString() || 0} lbs`}
          headlineDate={purchaseRec?.deadline || 'N/A'}
          vendorName={vendorInfo?.name || 'N/A'}
          unitPrice={`$${vendorInfo?.last_purchased_price?.toFixed(2) || '0.00'}/lb`}
          avgOrderQty={`${vendorInfo?.average_order_quantity?.toLocaleString() || 0} lbs`}
          avgLeadTime={`${vendorInfo?.average_lead_time_days || 0} Days`}
        />
      </div>

      {/* KPI row */}
      <div className={styles.kpiGrid}>
        <StatCard
          title="Total Stock"
          value={`${stockStatus?.total_stock?.toLocaleString() || 0} lbs`}
          iconSrc={stockIcon}
          type="stock"
          linkText="All Products"
        />
        <StatCard
          title="Open customer Orders"
          value={`${stockStatus?.open_customer_orders?.toLocaleString() || 0} lbs`}
          iconSrc={cartIcon}
          type="customer"
          metaDate={stockStatus?.last_customer_order_date || 'N/A'}
        />
       
        <StatCard
          title="Stock out"
          value={`${stockStatus?.stockout_in_months || 0} mo`}
          iconSrc={clockIcon}
          type="stockout"
        />

        <StatCard
          title="Open vendor Orders"
          value={`${stockStatus?.open_vendor_orders?.toLocaleString() || 0} lbs`}
          iconSrc={cartIcon}
          type="vendor"
          metaDate={stockStatus?.last_vendor_order_date || 'N/A'}
        />
        <StatCard
          title="Reorder by"
          value={stockStatus?.reorder_by_date || 'N/A'}
          iconSrc={calendarIcon}
          type="reorder"
          quantity={`${stockStatus?.reorder_quantity?.toLocaleString() || 0} lbs`}
        />
       
      </div>

      {/* Pricing History */}
      <div className="card" style={{ padding: 16 }}>
        <LineChartCard
          title="Pricing History"
          points={pricingHistoryPoints}
          yFormatter={(n) => `${n.toFixed(2)}`}
          activeRange={pricingActiveRange}
          onRangeChange={(range) => {
            setPricingActiveRange(range)
            setPricingDateRange(null)
          }}
          dateRange={pricingDateRange}
          onDateRangeChange={(range) => {
            setPricingDateRange(range)
            if (range) {
              setPricingActiveRange('')
            }
          }}
          showPricingTooltip={true}
        />
        {/* Summary Stats */}
        {pricingHistoryData?.data && (
          <div style={{ 
            display: 'flex', 
            gap: 32, 
            marginTop: 20, 
            paddingTop: 20, 
            borderTop: '1px solid #F3F4F6',
            justifyContent: 'flex-start'
          }}>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 400 }}>Lowest Price</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#10B981' }}>
                ${pricingHistoryData.data.lowest_price.toFixed(2)}/lb
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 400 }}>Highest Price</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#EF4444' }}>
                ${pricingHistoryData.data.highest_price.toFixed(2)}/lb
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 6, fontWeight: 400 }}>Average Price</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#3B82F6' }}>
                ${pricingHistoryData.data.average_price.toFixed(2)}/lb
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stocks By Location */}
      <div className="card" style={{ padding: 16, marginTop: 12 }}>
        <BarChartCard
          title="Stocks By Location"
          bars={stocksByLocationBars}
          yLabel="Quantity (lbs)"
          summaryStats={{
            inHand: stocksByLocationData?.data?.in_hand,
            reserved: stocksByLocationData?.data?.reserved,
            allocated: stocksByLocationData?.data?.allocated,
          }}
        />
      </div>
    </div>
  )
}


