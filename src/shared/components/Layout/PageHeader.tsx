import './Layout.css'

export default function PageHeader({ title, subtitle = 'AI-Powered Inventory Optimization' }: { title: string; subtitle?: string }) {
  return (
    <div className="page-header">
      <div className="page-title">{title}</div>
      <div className="page-subtitle">{subtitle}</div>
    </div>
  )
}


