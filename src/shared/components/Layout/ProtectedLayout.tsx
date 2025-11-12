import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import AppLayout from './AppLayout'

export default function ProtectedLayout() {
  // const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  // const otpVerified = useAuthStore(s => s.otpVerified)

  // if (!isAuthenticated) return <Navigate to="/auth/login" replace />
  // if (!otpVerified) return <Navigate to="/auth/verify" replace />

  return <AppLayout />
}


