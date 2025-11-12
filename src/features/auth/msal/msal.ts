import { PublicClientApplication, Configuration, LogLevel } from '@azure/msal-browser'

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string
const tenantId = (import.meta.env.VITE_AZURE_TENANT_ID as string | undefined) || 'common'
const redirectUri =
  (import.meta.env.VITE_AZURE_REDIRECT_URI as string | undefined) ||
  `${window.location.origin}/auth/login`

const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
    postLogoutRedirectUri: `${window.location.origin}/auth/login`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Error,
      piiLoggingEnabled: false,
    },
  },
}

export const pca = new PublicClientApplication(msalConfig)

export const loginRequest = {
  scopes: ['openid', 'profile', 'email', 'User.Read'],
}

export default pca


