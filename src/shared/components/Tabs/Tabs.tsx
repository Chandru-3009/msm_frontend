import { NavLink } from 'react-router-dom'

type TabItem = {
  to: string
  label: string
}

type TabsProps = {
  items: TabItem[]
  className?: string
}

export default function Tabs({ items, className }: TabsProps) {
  return (
    <nav className={`tabs-wrapper${className ? ` ${className}` : ''}`}>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => (isActive ? 'tab tab-active' : 'tab')}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}


