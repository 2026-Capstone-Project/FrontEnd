import type { MonthlyPatternDay, MonthlyPatternWeek } from '../types/repeat'

export const toDateValue = (value: Date | string | null | undefined) =>
  value instanceof Date ? value : value ? new Date(value) : null

export const formatCalendarDate = (value: Date | string | null | undefined) => {
  const dateValue = toDateValue(value)
  return dateValue ? dateValue.toLocaleDateString('ko-KR') : '날짜 선택'
}

export const formatIsoDate = (value: Date | string | null | undefined) => {
  const dateValue = toDateValue(value)
  if (!dateValue) return '날짜 선택'
  const year = dateValue.getFullYear()
  const month = String(dateValue.getMonth() + 1).padStart(2, '0')
  const day = String(dateValue.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const formatDisplayDate = (value: Date | string | null | undefined) => {
  const dateValue = toDateValue(value)
  if (!dateValue) return '날짜 선택'
  const year = dateValue.getFullYear()
  const month = String(dateValue.getMonth() + 1).padStart(2, '0')
  const day = String(dateValue.getDate()).padStart(2, '0')
  return `${year}. ${month}. ${day}`
}

export const weekLabel = (value: MonthlyPatternWeek) =>
  value === 'last' ? '마지막주' : `${value}주`
export const dayLabel = (value: MonthlyPatternDay) =>
  ({
    mon: '월요일',
    tue: '화요일',
    wed: '수요일',
    thu: '목요일',
    fri: '금요일',
    sat: '토요일',
    sun: '일요일',
    weekday: '주중',
    weekend: '주말',
    allweek: '1주 전체',
  })[value] ?? value
