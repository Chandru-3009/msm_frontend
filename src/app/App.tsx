import AppQueryProvider from './providers/QueryClientProvider'
import AppRouter from './router'

export default function App() {
  return (
    <AppQueryProvider>
      <div className="container">
        <AppRouter />
      </div>
    </AppQueryProvider>
  )
}


