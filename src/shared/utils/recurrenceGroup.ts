import { formatIsoDate } from '@/shared/utils/date'

import type { Week } from '../types/event/event'
import type { recurrenceGroup } from '../types/event/recurrence/recurrence'
import {
  defaultRepeatConfig,
  type MonthlyPatternDay,
  type MonthlyPatternWeek,
  type RepeatConfig,
  type WeekdayName,
} from '../types/event/recurrence/repeat'

type RecurrenceLike = recurrenceGroup & {
  interval?: number
  intervalValue?: number
  daysOfWeek?: Week[]
  dayOfWeekInMonth?: Week | Week[] | null
  isCustom?: boolean
}

const WEEKDAY_MAP: Record<Week, WeekdayName> = {
  SUNDAY: 'sun',
  MONDAY: 'mon',
  TUESDAY: 'tue',
  WEDNESDAY: 'wed',
  THURSDAY: 'thu',
  FRIDAY: 'fri',
  SATURDAY: 'sat',
}

const toWeekday = (value?: Week | null): WeekdayName | undefined =>
  value ? WEEKDAY_MAP[value] : undefined

const toWeekdays = (values?: Week[] | null) =>
  values ? values.map((value) => WEEKDAY_MAP[value]) : []

const toPatternWeek = (value?: number | null): MonthlyPatternWeek | undefined => {
  if (!value) return undefined
  if (value <= 0) return 'last'
  const normalized = Math.max(1, Math.min(5, value))
  return String(normalized) as MonthlyPatternWeek
}

const toPatternDay = (value?: Week | Week[] | null): MonthlyPatternDay | undefined => {
  if (!value) return undefined
  if (Array.isArray(value)) return toWeekday(value[0])
  return toWeekday(value)
}

export const mapRecurrenceGroupToRepeatConfig = (group?: recurrenceGroup | null): RepeatConfig => {
  if (!group) return { ...defaultRepeatConfig }

  const source = group as RecurrenceLike
  const interval = source.interval ?? source.intervalValue ?? 1
  const frequency = source.frequency

  const base: RepeatConfig = {
    ...defaultRepeatConfig,
    repeatType: 'custom',
    customBasis:
      frequency === 'DAILY'
        ? 'daily'
        : frequency === 'WEEKLY'
          ? 'weekly'
          : frequency === 'MONTHLY'
            ? 'monthly'
            : 'yearly',
  }

  if (frequency === 'DAILY') {
    base.customDailyInterval = interval
  }

  if (frequency === 'WEEKLY') {
    base.customWeeklyDays = toWeekdays(source.daysOfWeek ?? source.dayOfWeek)
    base.customWeeklyDays = base.customWeeklyDays.length > 0 ? base.customWeeklyDays : []
  }

  if (frequency === 'MONTHLY') {
    base.customMonthlyInterval = interval
    if (source.monthlyType === 'DAY_OF_WEEK') {
      base.customMonthlyMode = 'pattern'
      base.customMonthlyPatternWeek = toPatternWeek(source.weekOfMonth) ?? '1'
      base.customMonthlyPatternDay = toPatternDay(source.dayOfWeekInMonth) ?? 'mon'
    } else {
      base.customMonthlyMode = 'dates'
      base.customMonthlyDates = source.daysOfMonth ?? []
    }
  }

  if (frequency === 'YEARLY') {
    base.customYearlyInterval = interval
    base.customYearlyMonths = source.monthOfYear ? [source.monthOfYear] : []
    const yearlyWeek = toPatternWeek(source.weekOfMonth)
    const yearlyDay = toPatternDay(source.dayOfWeekInMonth)
    if (yearlyWeek && yearlyDay) {
      base.customYearlyConditionEnabled = true
      base.customYearlyConditionWeek = yearlyWeek
      base.customYearlyConditionDay = yearlyDay
    }
  }

  if (source.endType === 'END_BY_DATE') {
    base.customEndType = 'until'
    base.customEndDate = source.endDate ? formatIsoDate(source.endDate) : ''
  } else if (source.endType === 'END_BY_COUNT') {
    base.customEndType = 'count'
    base.customEndCount = source.occurrenceCount ?? undefined
  } else {
    base.customEndType = 'until'
    base.customEndDate = ''
  }

  return base
}
