import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import QuoteHistoryPage from '@/features/quotes/pages/QuoteHistoryPage'

const router = createBrowserRouter([
  { path: '/', element: <QuoteHistoryPage /> },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}


