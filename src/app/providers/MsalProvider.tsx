import { ReactNode, useEffect } from 'react'
import { MsalProvider as ReactMsalProvider } from '@azure/msal-react'
import { EventMessage, EventType, AuthenticationResult, AccountInfo } from '@azure/msal-browser'
import pca from '@/features/auth/msal/msal'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

type Props = {
  children: ReactNode
}

function MsalAuthSync({ children }: Props) {
  const setAuthenticatedFromMsal = useAuthStore(s => s.setAuthenticatedFromMsal)

  useEffect(() => {
    // Ensure MSAL processes any pending redirect hash
    pca
      .handleRedirectPromise()
      .then(result => {
        if (result?.account) {
          pca.setActiveAccount(result.account)
          const email = result.account.username
          void setAuthenticatedFromMsal(email)
        } else {
          const acct = pca.getActiveAccount() || pca.getAllAccounts()[0]
          if (acct) {
            pca.setActiveAccount(acct)
            void setAuthenticatedFromMsal(acct.username)
          }
        }
      })
      .catch(() => {
        // swallow errors; MSAL will log via loggerOptions
      })

    const callbackId = pca.addEventCallback((message: EventMessage) => {
      if (
        message.eventType === EventType.LOGIN_SUCCESS ||
        message.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        message.eventType === EventType.SSO_SILENT_SUCCESS ||
        message.eventType === EventType.HANDLE_REDIRECT_END
      ) {
        const payload = message.payload as AuthenticationResult | null
        const account: AccountInfo | undefined = payload?.account || pca.getActiveAccount() || pca.getAllAccounts()[0]
        if (account) {
          pca.setActiveAccount(account)
          void setAuthenticatedFromMsal(account.username)
        }
      }
    })

    return () => {
      if (callbackId) pca.removeEventCallback(callbackId)
    }
  }, [setAuthenticatedFromMsal])

  return <>{children}</>
}

export default function MsalProvider({ children }: Props) {
  return (
    <ReactMsalProvider instance={pca}>
      <MsalAuthSync>{children}</MsalAuthSync>
    </ReactMsalProvider>
  )
}


