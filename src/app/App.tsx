import AppQueryProvider from './providers/QueryClientProvider'
import MsalProvider from './providers/MsalProvider'
import AppRouter from './router'

export default function App() {
  return (
    <MsalProvider>
      <AppQueryProvider>
        <div className="container">
          <AppRouter />
        </div>
      </AppQueryProvider>
    </MsalProvider>
  )
}


