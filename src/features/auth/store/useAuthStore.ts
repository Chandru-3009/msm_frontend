import { create } from 'zustand'
import { pca, loginRequest } from '@/features/auth/msal/msal'

type AuthState = {
  isAuthenticated: boolean
  otpVerified: boolean
  email?: string
  pendingOtpCode?: string
  signInWithMicrosoft: () => Promise<void>
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
    })
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


