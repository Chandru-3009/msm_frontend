import './Layout.css'
import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'

type Item = { label: string; to: string }

export default function Sidebar({ logo }: { logo?: ReactNode }) {
  const items: Item[] = [
    { label: 'Dashboard', to: '/' },
    { label: 'Forecast', to: '/forecast' },
    { label: 'Inventory Master', to: '/inventory' },
    { label: 'Sales History', to: '/sales' },
    { label: 'Purchase History', to: '/purchase' },
    { label: 'Quote History', to: '/quotes' },
    { label: 'Data Upload', to: '/upload' },
    { label: 'Activity Logs', to: '/activity' },
    { label: 'User Management', to: '/users' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {logo ?? <span>MSM</span>}
      </div>
      <nav className="sidebar-nav">
        {items.map((i) => (
          <NavLink key={i.to} to={i.to} className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            {i.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">Settings</div>
    </aside>
  )
}


