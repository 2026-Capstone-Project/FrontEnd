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
  const today = new Date()
  const isToday =
    date &&
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  return (
    <S.CalendarDateHeaderCell weekend={weekend} isToday={isToday} onClick={onClick}>
      <div className="date">{label}</div>
    </S.CalendarDateHeaderCell>
  )
}

export default CalendarHeader
