import './SearchInput.css'
import SearchIcon from '@/assets/icons/search_icon.svg'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  width?: number
}

export default function SearchInput({ value, onChange, placeholder = 'Search', width = 260 }: Props) {
  return (
    <label className="search-wrap" style={{ width }}>
      <img src={SearchIcon} alt="Search" className="search-icon" />
      <input
        className="search-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}


