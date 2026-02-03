import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

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
  const combinedStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap,
    ...style,
  }

  return (
    <div style={combinedStyle} aria-live="polite" {...rest}>
      <div>{label}</div>
      <div>{children}</div>
    </div>
  )
}

export default SuspenseFallback
