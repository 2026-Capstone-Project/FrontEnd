import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { useMemo } from 'react'

type SuspenseFallbackProps = {
  label?: string
  gap?: number
  children?: ReactNode
} & HTMLAttributes<HTMLDivElement>

//TODO: 스타일 추가 필요
const SuspenseFallback = ({
  label = '로딩 중입니다',
  gap = 8,
  children,
  style,
  ...rest
}: SuspenseFallbackProps) => {
  const combinedStyle: CSSProperties = useMemo(
    () => ({
      display: 'flex',
      flexDirection: 'column',
      gap,
      ...style,
    }),
    [gap, style],
  )

  const spinnerStyle: CSSProperties = {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: '2px solid #ccc',
    borderTopColor: '#555',
  }

  return (
    <div style={combinedStyle} aria-live="polite" role="status" {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div aria-hidden="true" style={spinnerStyle} />
        <p style={{ margin: 0 }}>{label}</p>
      </div>
      <section>{children}</section>
    </div>
  )
}

export default SuspenseFallback
