import type { MonthlyPatternDay, MonthlyPatternWeek } from '../types/recurrence/repeat'

// Date/string/null 혼합 입력을 Date 또는 null로 정규화한다.
export const toDateValue = (value: Date | string | null | undefined) =>
  value instanceof Date ? value : value ? new Date(value) : null

// 캘린더 입력 필드에서 사용하는 로케일 날짜 포맷으로 변환한다.
export const formatCalendarDate = (value: Date | string | null | undefined) => {
  const dateValue = toDateValue(value)
  return dateValue ? dateValue.toLocaleDateString('ko-KR') : '날짜 선택'
}

// API 송수신에 사용할 ISO 형식(YYYY-MM-DD) 문자열을 생성한다.
export const formatIsoDate = (value: Date | string | null | undefined) => {
  const dateValue = toDateValue(value)
  if (!dateValue) return '날짜 선택'
  const year = dateValue.getFullYear()
  const month = String(dateValue.getMonth() + 1).padStart(2, '0')
  const day = String(dateValue.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 화면 표시용 날짜 포맷(YYYY. MM. DD)으로 변환한다.
export const formatDisplayDate = (value: Date | string | null | undefined) => {
  const dateValue = toDateValue(value)
  if (!dateValue) return '날짜 선택'
  const year = dateValue.getFullYear()
  const month = String(dateValue.getMonth() + 1).padStart(2, '0')
  const day = String(dateValue.getDate()).padStart(2, '0')
  return `${year}. ${month}. ${day}`
}

// 반복 설정의 주차 값을 UI 라벨 문자열로 변환한다.
export const weekLabel = (value: MonthlyPatternWeek) =>
  value === 'last' ? '마지막주' : `${value}주`

// 반복 설정의 요일/규칙 키를 사용자에게 보여줄 한글 라벨로 변환한다.
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
