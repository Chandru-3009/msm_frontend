import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import logo from '@/assets/images/app_logo.svg'
import { useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'

export default function LoginPage() {
  const signInWithMicrosoft = useAuthStore(s => s.signInWithMicrosoft)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const navigate = useNavigate()
  const { inProgress } = useMsal()
  const busy = inProgress !== InteractionStatus.None

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/auth/verify', { replace: true })
    }
  }, [isAuthenticated, navigate])

  async function handleMicrosoftLogin() {
    if (busy) return
    await signInWithMicrosoft()
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <img src={logo} alt="MSM" width={76} height={40} style={{ marginBottom: 10 }} />
        <h2 style={{ margin: 0 }}>Welcome Back!</h2>
        <p style={{ color: '#6b7280', marginTop: 6 }}>Use your organization account to continue</p>
        <button
          disabled={busy}
          onClick={handleMicrosoftLogin}
          style={{
            marginTop: 18,
            height: 40,
            padding: '0 16px',
            background: '#0a397a',
            color: '#fff',
            borderRadius: 6,
            border: '1px solid #0a397a',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: busy ? 'not-allowed' : 'pointer',
            opacity: busy ? 0.6 : 1,
            pointerEvents: busy ? 'none' : 'auto',
          }}
        >
          <img src="https://authjs.dev/img/providers/azure.svg" alt="" width={16} height={16} />
          <span>Sign in with Microsoft</span>
        </button>
      </div>
    </div>
  )
}


