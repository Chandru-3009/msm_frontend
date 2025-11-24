export type CompactFormatOptions = {
  locale?: string
  maximumFractionDigits?: number
  minimumFractionDigits?: number
}

export function formatCompactNumber(
  value: number,
  options: CompactFormatOptions = {}
): string {
  const {
    locale = 'en-US',
    maximumFractionDigits = 1,
    minimumFractionDigits = 0,
  } = options

  if (!Number.isFinite(value)) return '0'

  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value)
}

export type CompactCurrencyOptions = CompactFormatOptions & {
  currency?: string
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name'
}

export function formatCompactCurrency(
  value: number,
  options: CompactCurrencyOptions = {}
): string {
  const {
    locale = 'en-US',
    currency = 'USD',
    currencyDisplay = 'narrowSymbol',
    maximumFractionDigits = 1,
    minimumFractionDigits = 0,
  } = options

  if (!Number.isFinite(value)) return '$0'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay,
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value)
}

export function formatWithSign(value: number): string {
  if (!Number.isFinite(value)) return '0%'
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)}%`
}


