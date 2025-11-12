import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export default function VerifySuccessPage() {
  const otpVerified = useAuthStore(s => s.otpVerified)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const navigate = useNavigate()

  if (!isAuthenticated) {
    navigate('/auth/login', { replace: true })
    return null
  }
  if (!otpVerified) {
    navigate('/auth/verify', { replace: true })
    return null
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <img src="/logo.svg" alt="MSM" width={76} height={40} style={{ marginBottom: 10 }} />
        <h2 style={{ margin: 0 }}>Verification Successful</h2>
        <p style={{ color: '#6b7280', marginTop: 6 }}>
          Your account has been verified. Click below to continue to your dashboard.
        </p>
        <button
          onClick={() => navigate('/dashboard', { replace: true })}
          style={{
            marginTop: 14,
            height: 40,
            padding: '0 16px',
            background: '#0a397a',
            color: '#fff',
            borderRadius: 6,
            border: '1px solid #0a397a',
            cursor: 'pointer',
          }}
        >
          Get Started →
        </button>
      </div>
    </div>
  )
}


