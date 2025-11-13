import { create } from 'zustand'
import { ApiClient } from '@/shared/api/http'
import { pca, loginRequest } from '@/features/auth/msal/msal'

type AuthState = {
  isAuthenticated: boolean
  otpVerified: boolean
  email?: string
  pendingOtpCode?: string
  token?: string
  signInWithMicrosoft: () => Promise<void>
  signInWithCredentials: (username: string, password: string) => Promise<boolean>
  resendOtp: () => Promise<void>
  verifyOtp: (code: string) => Promise<boolean>
  signOut: () => void
  setAuthenticatedFromMsal: (email: string) => Promise<void>
}

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  otpVerified: false,
  email: undefined,
  pendingOtpCode: undefined,
  token: undefined,

  // Microsoft sign-in via MSAL popup (allows user to cancel/try again)
  async signInWithMicrosoft() {
    try {
      const result = await pca.loginPopup(loginRequest)
      if (result?.account) {
        pca.setActiveAccount(result.account)
        await get().setAuthenticatedFromMsal(result.account.username)
      }
    } catch (e: any) {
      if (e?.errorCode === 'interaction_in_progress') return
      throw e
    }
  },

  // Temporary credential login using backend API (until MSAL is ready)
  async signInWithCredentials(username: string, password: string) {
    try {
      const resp = await ApiClient.post('/auth/login/', { username, password })
      // Try common token field names
      const token = resp.data.data.tokens.access
     
      console.log("response", resp)

      if (token) {
        localStorage.setItem('authToken', token)
      }

      set({
        isAuthenticated: true,
        otpVerified: true, // bypass OTP flow for this temporary path
        email: username,
        token: token || undefined,
      })
      return true
    } catch (e) {
      return false
    }
  },

  async resendOtp() {
    // Simulate email OTP delivery
    const code = generateOtp()
    // Expose in dev console so testers can copy it
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log('[DEV] OTP code:', code)
    }
    set({ pendingOtpCode: code })
  },

  async verifyOtp(code: string) {
    const isValid = code === get().pendingOtpCode
    if (isValid) {
      set({ otpVerified: true, pendingOtpCode: undefined })
    }
    return isValid
  },

  signOut() {
    // Best-effort reset local state immediately
    set({
      isAuthenticated: false,
      otpVerified: false,
      email: undefined,
      pendingOtpCode: undefined,
      token: undefined,
    })
    localStorage.removeItem('authToken')
    // Trigger MSAL logout flow
    void pca.logoutRedirect({
      postLogoutRedirectUri: `${window.location.origin}/auth/login`,
    })
  },

  async setAuthenticatedFromMsal(email: string) {
    set({ isAuthenticated: true, email, otpVerified: false })
    await get().resendOtp()
  },
}))


