import './Layout.css'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <div className="content-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}


