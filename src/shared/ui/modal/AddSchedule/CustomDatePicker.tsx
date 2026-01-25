import { useMemo, useState } from 'react'

import { type DatePickerRenderProps, toDateValue } from './AddSchedule.types'
import * as S from './CustomDatePicker.style'

const CustomDatePicker = ({ selectedDate, onSelectDate, onClose }: DatePickerRenderProps) => {
  const baseDate = useMemo(() => toDateValue(selectedDate) ?? new Date(), [selectedDate])
  const [monthOffset, setMonthOffset] = useState(0)
  const displayMonth = useMemo(
    () => new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1),
    [baseDate, monthOffset],
  )

  const days = useMemo(() => {
    const startOfMonth = new Date(displayMonth)
    const startDay = startOfMonth.getDay()
    const gridStart = new Date(startOfMonth)
    gridStart.setDate(startOfMonth.getDate() - startDay)
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(gridStart)
      day.setDate(gridStart.getDate() + index)
      return day
    })
  }, [displayMonth])

  const activeDay = toDateValue(selectedDate)

  return (
    <S.CustomCalendarRoot>
      <S.CustomCalendarHeader>
        <S.CustomCalendarTitle>
          {`${displayMonth.getFullYear()}년 ${(displayMonth.getMonth() + 1).toString().padStart(2, '0')}월`}
        </S.CustomCalendarTitle>
        <div>
          <S.CustomCalendarNav type="button" onClick={() => setMonthOffset((prev) => prev - 1)}>
            이전
          </S.CustomCalendarNav>
          <S.CustomCalendarNav type="button" onClick={() => setMonthOffset((prev) => prev + 1)}>
            다음
          </S.CustomCalendarNav>
          <S.CustomCalendarClose type="button" onClick={onClose}>
            닫기
          </S.CustomCalendarClose>
        </div>
      </S.CustomCalendarHeader>
      <S.CustomCalendarWeekdays>
        {['일', '월', '화', '수', '목', '금', '토'].map((label) => (
          <S.CustomCalendarWeekday key={label}>{label}</S.CustomCalendarWeekday>
        ))}
      </S.CustomCalendarWeekdays>
      <S.CustomCalendarDays>
        {days.map((day) => (
          <S.CustomCalendarDay
            type="button"
            key={day.toISOString()}
            isActive={activeDay ? activeDay.toDateString() === day.toDateString() : false}
            isCurrentMonth={day.getMonth() === displayMonth.getMonth()}
            onClick={() => onSelectDate(new Date(day))}
          >
            <S.CustomCalendarDayNumber>{day.getDate()}</S.CustomCalendarDayNumber>
          </S.CustomCalendarDay>
        ))}
      </S.CustomCalendarDays>
    </S.CustomCalendarRoot>
  )
}

export default CustomDatePicker
