import * as S from './CalendarDateHeader.style'

const CalendarHeader = ({
  label,
  date,
  onClick,
}: {
  label: string
  date: Date
  onClick: () => void
}) => {
  const day = date?.getDay() ?? 0
  const weekend = day === 0 ? 'sun' : day === 6 ? 'sat' : undefined
  return (
    <S.CalendarDateHeaderCell weekend={weekend} onClick={onClick}>
      {label}
    </S.CalendarDateHeaderCell>
  )
}

export default CalendarHeader
