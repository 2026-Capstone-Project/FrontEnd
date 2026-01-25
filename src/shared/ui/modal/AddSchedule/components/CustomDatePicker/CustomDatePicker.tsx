/** @jsxImportSource @emotion/react */
import { useMemo, useState } from 'react'

import Arrow from '@/shared/assets/icons/chevron.svg?react'
import { theme } from '@/shared/styles/theme'
import { type DatePickerRenderProps } from '@/shared/types/event'
import { toDateValue } from '@/shared/utils/date'

import * as S from './CustomDatePicker.style'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const CustomDatePicker = ({ selectedDate, onSelectDate }: DatePickerRenderProps) => {
  const baseDate = useMemo(() => toDateValue(selectedDate) ?? new Date(), [selectedDate])
  const [monthOffset, setMonthOffset] = useState(0)
  const displayMonth = useMemo(
    () => new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset, 1),
    [baseDate, monthOffset],
  )

  const days = useMemo(() => {
    const startOfMonth = new Date(displayMonth)
    const startDay = startOfMonth.getDay()
    const daysInMonth = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + 1,
      0,
    ).getDate()
    const weeks = Math.ceil((startDay + daysInMonth) / 7)
    const cells = weeks * 7

    return Array.from({ length: cells }, (_, index) => {
      const dayNumber = index - startDay + 1
      if (dayNumber < 1 || dayNumber > daysInMonth) {
        return null
      }
      const day = new Date(displayMonth)
      day.setDate(dayNumber)
      return day
    })
  }, [displayMonth])

  const activeDay = toDateValue(selectedDate)

  return (
    <S.CustomCalendarRoot>
      <S.Year> {`${displayMonth.getFullYear()}`}</S.Year>
      <S.CustomCalendarHeader>
        <Arrow
          color={theme.colors.textColor2}
          type="button"
          onClick={() => setMonthOffset((prev) => prev - 1)}
        />
        <S.CustomCalendarTitle>
          {`${(displayMonth.getMonth() + 1).toString().padStart(2, '0')}월`}
        </S.CustomCalendarTitle>
        <Arrow
          type="button"
          color={theme.colors.textColor2}
          onClick={() => setMonthOffset((prev) => prev + 1)}
          css={{ rotate: '180deg' }}
        />
      </S.CustomCalendarHeader>
      <S.CustomCalendarWeekdays>
        {WEEKDAYS.map((label, index) => (
          <S.CustomCalendarWeekday key={`${label}-${index}`} dayIndex={index}>
            {label}
          </S.CustomCalendarWeekday>
        ))}
      </S.CustomCalendarWeekdays>
      <S.CustomCalendarDays>
        {days.map((day, index) => (
          <S.CustomCalendarDay
            type="button"
            key={day ? day.toISOString() : `empty-${index}`}
            isActive={
              day ? (activeDay ? activeDay.toDateString() === day.toDateString() : false) : false
            }
            isCurrentMonth={!!day}
            isPlaceholder={!day}
            disabled={!day}
            onClick={() => day && onSelectDate(new Date(day))}
          >
            {day && <S.CustomCalendarDayNumber>{day.getDate()}</S.CustomCalendarDayNumber>}
          </S.CustomCalendarDay>
        ))}
      </S.CustomCalendarDays>
    </S.CustomCalendarRoot>
  )
}

export default CustomDatePicker
