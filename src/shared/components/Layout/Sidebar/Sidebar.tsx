import styles from './Sidebar.module.css'
import { NavLink } from 'react-router-dom'
import Logo from '@/assets/images/Logo.svg'
import purchaseIcon from '@/assets/icons/navicons/purchase_icon.svg'
import dashboardIcon from '@/assets/icons/navicons/dashboard_icon.svg'
import forecastIcon from '@/assets/icons/navicons/forecast_icon.svg'
import inventoryIcon from '@/assets/icons/navicons/inventory_icon.svg'
import salesIcon from '@/assets/icons/navicons/sales_icon.svg'
import quotesIcon from '@/assets/icons/navicons/quotes_icon.svg'
import uploadIcon from '@/assets/icons/navicons/data_upload_icon.svg'
import usersIcon from '@/assets/icons/navicons/user_icon.svg'
import customersIcon from '@/assets/icons/navicons/customer_icon.svg'
import vendorsIcon from '@/assets/icons/navicons/vendor_icon.svg'
import Avatar from '@/shared/components/Avatar'

type Item = { label: string; to: string; iconUrl?: string }



export default function Sidebar() {
  const items: Item[] = [
    { label: 'Dashboard', to: '/dashboard', iconUrl: dashboardIcon },
    { label: 'Forecast', to: '/forecast', iconUrl: forecastIcon },
    { label: 'Inventory', to: '/inventory', iconUrl: inventoryIcon },
    { label: 'Sales', to: '/sales', iconUrl: salesIcon },
    { label: 'Purchase', to: '/purchase', iconUrl: purchaseIcon },
    { label: 'Quotes', to: '/quotes', iconUrl: quotesIcon },
    { label: 'Customer', to: '/customers', iconUrl: customersIcon },
    { label: 'Vendors', to: '/vendors', iconUrl: vendorsIcon },
    { label: 'Data Upload', to: '/upload', iconUrl: uploadIcon },
    { label: 'User Management', to: '/users', iconUrl: usersIcon },
  ]

  const footerData = {
    profileimage: null,
    firstName: 'Raj',
    lastName: 'Developer',
    userRole: 'Admin'
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
      <img src={Logo} alt="logo" />
      </div>
      <nav className={styles.nav}>
         {items.map((i) => (
           <NavLink
             key={i.to}
             to={i.to}
             className={({ isActive }) => `${styles.link}${isActive ? ` ${styles.active}` : ''}`}
           >
             {i.iconUrl && (
               <span
                 aria-hidden="true"
                 className={styles.icon}
                 style={{ WebkitMaskImage: `url(${i.iconUrl})`, maskImage: `url(${i.iconUrl})` }}
               />
             )}
             {i.label}
           </NavLink>
         ))}
      </nav>
      <div className={styles.footer}>
        <div className={styles.footerUser}>
          <Avatar firstName={footerData.firstName} lastName={footerData.lastName} imageUrl={footerData.profileimage} size={44} />
          <div>
            <div className={styles.footerName}>{footerData.firstName} {footerData.lastName}</div>
            <div className={styles.footerRole}>{footerData.userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}


