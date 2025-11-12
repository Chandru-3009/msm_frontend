import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <Outlet />
      </div>
      <footer className="auth-footer">© 2025 MSM. All Rights Reserved.</footer>
    </div>
  )
}


