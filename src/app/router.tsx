import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import QuoteHistoryPage from '@/features/quotes/pages/QuoteHistoryPage'
import PurchaseHistoryPage from '@/features/purchase/pages/PurchaseHistoryPage'
import ForecastPage from '@/features/forecast/pages/ForecastPage'
import InventoryPage from '@/features/inventory/pages/InventoryPage'
import InventoryDetailPage from '@/features/inventory/pages/InventoryDetailPage'
import SalesHistoryPage from '@/features/sales/pages/SalesHistoryPage'
import Dashboard from '@/features/dashboard/pages/Dashboard'
import UserManagementPage from '@/features/users/pages/UserManagementPage'
import DataUploadPage from '@/features/uploads/pages/DataUploadPage'
import ActivityLogsPage from '@/features/activity/pages/ActivityLogsPage'
import ProtectedLayout from '@/shared/components/Layout/ProtectedLayout'
import AuthLayout from '@/shared/components/Layout/AuthLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import VerifyOtpPage from '@/features/auth/pages/VerifyOtpPage'
import VerifySuccessPage from '@/features/auth/pages/VerifySuccessPage'
import StockSalesTab from '@/features/inventory/pages/tabs/StockSalesTab'
import SalesHistoryTab from '@/features/inventory/pages/tabs/SalesHistoryTab'
import PurchaseHistoryTab from '@/features/inventory/pages/tabs/PurchaseHistoryTab'
import QuoteHistoryTab from '@/features/inventory/pages/tabs/QuoteHistoryTab'

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'verify', element: <VerifyOtpPage /> },
      { path: 'success', element: <VerifySuccessPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'forecast', element: <ForecastPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      {
        path: 'inventory/:id',
        element: <InventoryDetailPage />,
        children: [
          { index: true, element: <Navigate to="stocksales" replace /> },
          { path: 'stocksales', element: <StockSalesTab /> },
          { path: 'saleshistory', element: <SalesHistoryTab /> },
          { path: 'purchasehistory', element: <PurchaseHistoryTab /> },
          { path: 'quotehistory', element: <QuoteHistoryTab /> },
        ],
      },
      { path: 'sales', element: <SalesHistoryPage /> },
      { path: 'upload', element: <DataUploadPage /> },
      { path: 'activity', element: <ActivityLogsPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'quotes', element: <QuoteHistoryPage /> },
      { path: 'purchase', element: <PurchaseHistoryPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}


