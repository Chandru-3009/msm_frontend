import { FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export default function VerifyOtpPage() {
  const email = useAuthStore(s => s.email)
  const resendOtp = useAuthStore(s => s.resendOtp)
  const verifyOtp = useAuthStore(s => s.verifyOtp)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true })
      return
    }
    // Focus field by default
    inputRef.current?.focus()
  }, [isAuthenticated, navigate])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const ok = await verifyOtp(code)
    if (ok) {
      navigate('/auth/success', { replace: true })
    } else {
      setError('Invalid code. Please try again.')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <img src="/logo.svg" alt="MSM" width={76} height={40} style={{ marginBottom: 10 }} />
        <h2 style={{ margin: 0 }}>Verify Your Identity</h2>
        <p style={{ color: '#6b7280', marginTop: 6 }}>
          We&apos;ve sent a verification code to <strong>{email}</strong>
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 12, width: '100%' }}>
          <input
            ref={inputRef}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit code"
            style={{
              width: '100%',
              height: 44,
              borderRadius: 6,
              border: '1px solid #d1d5db',
              padding: '0 12px',
              fontSize: 18,
              textAlign: 'center',
              letterSpacing: 6,
            }}
          />
          {error ? <div style={{ color: '#b91c1c', marginTop: 8 }}>{error}</div> : null}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <button
              type="button"
              onClick={() => resendOtp()}
              style={{ background: 'transparent', border: 'none', color: '#0a397a', cursor: 'pointer' }}
            >
              Resend verification code
            </button>
            <button
              type="submit"
              style={{
                height: 40,
                padding: '0 16px',
                background: '#0a397a',
                color: '#fff',
                borderRadius: 6,
                border: '1px solid #0a397a',
                cursor: 'pointer',
              }}
            >
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


