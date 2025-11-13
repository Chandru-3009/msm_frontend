import styles from './BackHeader.module.css'
import backIcon from '@/assets/icons/back_icon.svg'
import Typography from '@/shared/components/Typography'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  to?: string
  onBack?: () => void
  label?: string
  title?: ReactNode
  right?: ReactNode
}

export default function BackHeader({ to, onBack, label, title, right }: Props) {
  const navigate = useNavigate()
  const handleBack = () => {
    if (onBack) return onBack()
    if (to) navigate(to)
  }

  return (
    <div className={styles.headerRow} onClick={handleBack}>
      <button className={styles.backButton} >
        <img src={backIcon} alt="" />
      </button>
      {label && <Typography size="lg" weight="bold" color="heading">{label}</Typography>}
      {title}
      <div className={styles.spacer} />
      {right}
    </div>
  )
}


