import { type HeaderProps } from 'react-big-calendar'

import { formatDayHeaderLabel, formatWeekday } from '@/features/Calendar/utils/formatters'

import * as S from './CalendarHeader.style'

type CalendarHeaderProps = HeaderProps & {
  onAdd?: (date: Date) => void
}

const CustomHeader = ({ date, onAdd }: CalendarHeaderProps) => {
  const dayName = formatWeekday(date)
  const dayNumber = formatDayHeaderLabel(date)

  return (
    <S.HeaderContainer>
      <span className="day-name">{dayName}</span>
      <div className="day-number-wrapper" onClick={() => onAdd?.(date)}>
        <span className="day-number">{dayNumber}</span>
      </div>
    </S.HeaderContainer>
  )
}

export default CustomHeader
