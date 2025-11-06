import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import QuoteHistoryPage from '@/features/quotes/pages/QuoteHistoryPage'
import AppLayout from '@/shared/components/Layout/AppLayout'
import PurchaseHistoryPage from '@/features/purchase/pages/PurchaseHistoryPage'
import ForecastPage from '@/features/forecast/pages/ForecastPage'
import InventoryPage from '@/features/inventory/pages/InventoryPage'
import SalesHistoryPage from '@/features/sales/pages/SalesHistoryPage'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import UserManagementPage from '@/features/users/pages/UserManagementPage'
import DataUploadPage from '@/features/uploads/pages/DataUploadPage'
import ActivityLogsPage from '@/features/activity/pages/ActivityLogsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'forecast', element: <ForecastPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'sales', element: <SalesHistoryPage /> },
      { path: 'upload', element: <DataUploadPage /> },
      { path: 'activity', element: <ActivityLogsPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'quotes', element: <QuoteHistoryPage /> },
      { path: 'purchase', element: <PurchaseHistoryPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}


