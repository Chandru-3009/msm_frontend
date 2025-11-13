import styles from './Pagination.module.css'

type Props = {
  page: number       // zero-based
  pageCount: number  // total pages
  onPageChange: (page: number) => void
  className?: string
}

type Item = number | 'start-ellipsis' | 'end-ellipsis'

function getItems(page: number, count: number, siblingCount = 1, boundaryCount = 1): Item[] {
  // For small page counts, show all pages directly to avoid duplicates
  if (count <= boundaryCount * 2 + siblingCount * 2 + 3) {
    return range(1, count)
  }
  const startPages = range(1, Math.min(boundaryCount, count))
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count)
  const start = Math.max(
    Math.min(page + 1 - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  )
  const end = Math.min(
    Math.max(page + 1 + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1
  )
  const siblings = range(start, end)

  const items: Item[] = [
    ...startPages,
    ...(start > boundaryCount + 2 ? ['start-ellipsis' as const] : start === boundaryCount + 2 ? [boundaryCount + 1] : []),
    ...siblings,
    ...(end < count - boundaryCount - 1 ? ['end-ellipsis' as const] : end === count - boundaryCount - 1 ? [count - boundaryCount] : []),
    ...endPages,
  ]
  // Defensive: remove any accidental duplicates while preserving order
  const seen = new Set<string>()
  return items.filter((it) => {
    const key = String(it)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function range(start: number, end: number): number[] {
  const out: number[] = []
  for (let i = start; i <= end; i++) out.push(i)
  return out
}

export default function Pagination({ page, pageCount, onPageChange, className }: Props) {
  const canPrev = page > 0
  const canNext = page + 1 < pageCount
  const items = getItems(page, Math.max(1, pageCount))

  return (
    <div className={styles.root + (className ? ` ${className}` : '')} role="navigation" aria-label="pagination">
      <button className={styles.side} onClick={() => canPrev && onPageChange(page - 1)} disabled={!canPrev}>
        <span className={styles.arrow} aria-hidden="true">←</span> Previous
      </button>
      <div className={styles.pages}>
        {items.map((it, idx) => {
          if (typeof it === 'number') {
            const pIndex = it - 1
            return (
              <button
                key={`${it}-${idx}`}
                className={styles.page}
                aria-current={pIndex === page ? 'page' : undefined}
                onClick={() => onPageChange(pIndex)}
              >
                {it}
              </button>
            )
          }
          return <span key={`${it}-${idx}`} className={styles.ellipsis}>…</span>
        })}
      </div>
      <button className={styles.side} onClick={() => canNext && onPageChange(page + 1)} disabled={!canNext}>
        Next <span className={styles.arrow} aria-hidden="true">→</span>
      </button>
    </div>
  )
}


