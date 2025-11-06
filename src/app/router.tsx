import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import QuoteHistoryPage from '@/features/quotes/pages/QuoteHistoryPage'
import AppLayout from '@/shared/components/Layout/AppLayout'
import PurchaseHistoryPage from '@/features/purchase/pages/PurchaseHistoryPage'
import ForecastPage from '@/features/forecast/pages/ForecastPage'
import InventoryPage from '@/features/inventory/pages/InventoryPage'
import SalesHistoryPage from '@/features/sales/pages/SalesHistoryPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'forecast', element: <ForecastPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'sales', element: <SalesHistoryPage /> },
      { path: 'quotes', element: <QuoteHistoryPage /> },
      { path: 'purchase', element: <PurchaseHistoryPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}


