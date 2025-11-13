import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import logo from '@/assets/images/app_logo.svg'
import { useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import Button from '@/shared/components/Button'

export default function LoginPage() {
  const signInWithMicrosoft = useAuthStore(s => s.signInWithMicrosoft)
  const signInWithCredentials = useAuthStore(s => s.signInWithCredentials)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const navigate = useNavigate()
  const { inProgress } = useMsal()
  const busy = inProgress !== InteractionStatus.None
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
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
        <p style={{ color: '#6b7280', marginTop: 6 }}>Use your credentials to continue</p>

        <div className="card" style={{ padding: 16, width: 320, display: 'grid', gap: 10, marginTop: 10 }}>
          {error && <div className="small" style={{ color: '#dc2626' }}>{error}</div>}
          <div style={{ display: 'grid', gap: 6 }}>
            <label className="small">Username</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            <label className="small">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </div>
          <Button
            variant="primary"
            onClick={async () => {
              setError(undefined)
              const ok = await signInWithCredentials(username, password)
              if (!ok) setError('Invalid credentials or server unavailable.')
            }}
          >
            Sign in
          </Button>

          <div className="small" style={{ textAlign: 'center', color: '#6b7280', marginTop: 4 }}>— or —</div>
          <Button variant="secondary" onClick={handleMicrosoftLogin} disabled={busy}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <img src="https://authjs.dev/img/providers/azure.svg" alt="" width={16} height={16} />
              Sign in with Microsoft
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}


