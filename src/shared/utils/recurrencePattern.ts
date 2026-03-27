import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { Week } from '@/shared/types/event/event'
import type { RecurrenceGroup } from '@/shared/types/recurrence/recurrence'

const WEEKDAY_BY_INDEX: Week[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

export type RecurrenceLike = RecurrenceGroup & {
  interval?: number
  dayOfWeekInMonth?: RecurrenceGroup['dayOfWeekInMonth'] | Week[]
}

// Date에서 서버 반복 규칙에 쓰는 요일 enum을 계산한다.
export const toWeekday = (value: Date): Week => WEEKDAY_BY_INDEX[value.getDay()]

// 1~5주차 또는 마지막주(-1) 값을 반환합니다.
// 월 경계를 넘기는 다음 주 날짜를 확인해 "마지막 주"를 판정합니다.
export const toWeekOfMonth = (value: Date) => {
  const weekNumber = Math.floor((value.getDate() - 1) / 7) + 1
  const nextWeek = new Date(value)
  nextWeek.setDate(value.getDate() + 7)
  return nextWeek.getMonth() === value.getMonth() ? weekNumber : -1
}

export const isSameYmd = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

// dayOfWeekInMonth가 배열로 들어오는 케이스를 단일 요일 값으로 정규화한다.
export const normalizeDayOfWeekInMonth = (
  value: RecurrenceLike['dayOfWeekInMonth'],
): RecurrenceGroup['dayOfWeekInMonth'] => {
  if (value == null) return value
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

// recurrenceGroup은 API/로컬 상태에서 모양이 조금씩 달라질 수 있어,
// patch 전에는 공통 DTO 형태(intervalValue/dayOfWeekInMonth 등)로 맞춰서 사용합니다.
export const normalizeRecurrenceGroupPayload = (
  group: CalendarEvent['recurrenceGroup'] | RecurrenceGroup | null | undefined,
): RecurrenceGroup | null => {
  if (!group) return null
  const source = group as RecurrenceLike
  return {
    frequency: source.frequency,
    endType: source.endType,
    intervalValue: source.intervalValue ?? source.interval ?? 1,
    ...(source.endDate ? { endDate: source.endDate } : {}),
    ...(source.occurrenceCount != null ? { occurrenceCount: source.occurrenceCount } : {}),
    ...(source.daysOfWeek ? { daysOfWeek: [...source.daysOfWeek] } : {}),
    ...(source.monthlyType ? { monthlyType: source.monthlyType } : {}),
    ...(source.weekOfMonth != null ? { weekOfMonth: source.weekOfMonth } : {}),
    ...(source.daysOfMonth ? { daysOfMonth: [...source.daysOfMonth] } : {}),
    ...(source.weekdayRule ? { weekdayRule: source.weekdayRule } : {}),
    ...(source.dayOfWeekInMonth !== undefined
      ? { dayOfWeekInMonth: normalizeDayOfWeekInMonth(source.dayOfWeekInMonth) }
      : {}),
    ...(source.monthOfYear != null ? { monthOfYear: source.monthOfYear } : {}),
  }
}
