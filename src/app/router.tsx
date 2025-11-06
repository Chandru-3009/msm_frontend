import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import QuoteHistoryPage from '@/features/quotes/pages/QuoteHistoryPage'
import AppLayout from '@/shared/components/Layout/AppLayout'
import PurchaseHistoryPage from '@/features/purchase/pages/PurchaseHistoryPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: 'quotes', element: <QuoteHistoryPage /> },
      { path: 'purchase', element: <PurchaseHistoryPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}


