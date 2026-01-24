import { type HeaderProps } from 'react-big-calendar'

import { formatDayHeaderLabel, formatWeekday } from '@/features/Calendar/utils/formatters'

import * as S from './CalendarHeader.style'

const CustomHeader = ({ date }: HeaderProps) => {
  const dayName = formatWeekday(date)
  const dayNumber = formatDayHeaderLabel(date)

  return (
    <S.HeaderContainer>
      <span className="day-name">{dayName}</span>
      <div className="day-number-wrapper">
        <span className="day-number">{dayNumber}</span>
      </div>
    </S.HeaderContainer>
  )
}

export default CustomHeader
