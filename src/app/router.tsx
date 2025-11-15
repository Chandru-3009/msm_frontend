import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import QuoteHistoryPage from '@/features/quotes/pages/QuoteHistoryPage'
import PurchaseHistoryPage from '@/features/purchase/pages/PurchaseHistoryPage'
import ForecastPage from '@/features/forecast/pages/ForecastPage'
import InventoryPage from '@/features/inventory/pages/InventoryPage'
import InventoryDetailPage from '@/features/inventory/pages/InventoryDetailPage'
import CustomersPage from '@/features/customers/pages/CustomersPage'
import CustomerOrdersPage from '@/features/customers/pages/CustomerOrdersPage'
import OrderDetailPage from '@/features/customers/pages/OrderDetailPage'
import SalesHistoryPage from '@/features/sales/pages/SalesHistoryPage'
import SalesDetailPage from '@/features/sales/pages/SalesDetailPage'
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
import VendorsPage from '@/features/vendors/pages/VendorsPage'
import VendorOrdersPage from '@/features/vendors/pages/VendorOrdersPage'
import VendorOrderDetailPage from '@/features/vendors/pages/OrderDetailPage'
import PurchaseDetailPage from '@/features/purchase/pages/PurchaseDetailPage'
import QuoteDetailPage from '@/features/quotes/pages/QuoteDetailPage'

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
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/:id', element: <CustomerOrdersPage /> },
      { path: 'customers/:id/orders/:orderId', element: <OrderDetailPage /> },
      { path: 'vendors', element: <VendorsPage /> },
      { path: 'vendors/:id', element: <VendorOrdersPage /> },
      { path: 'vendors/:id/orders/:orderId', element: <VendorOrderDetailPage /> },
      { path: 'sales', element: <SalesHistoryPage /> },
      { path: 'sales/:id', element: <SalesDetailPage /> },
      { path: 'upload', element: <DataUploadPage /> },
      { path: 'activity', element: <ActivityLogsPage /> },
      { path: 'users', element: <UserManagementPage /> },
      { path: 'quotes', element: <QuoteHistoryPage /> },
      { path: 'quotes/:id', element: <QuoteDetailPage /> },
      { path: 'purchase', element: <PurchaseHistoryPage /> },
      { path: 'purchase/:id', element: <PurchaseDetailPage /> },
    ],
  },
  { path: '*', element: <Navigate to='/' replace /> },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}


