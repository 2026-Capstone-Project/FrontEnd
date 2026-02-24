import { formatIsoDate } from '@/shared/utils/date'

import type { Week } from '../types/event/event'
import type { MonthlyWeekDayRule, RecurrenceGroup } from '../types/recurrence/recurrence'
import {
  defaultRepeatConfig,
  type MonthlyPatternDay,
  type MonthlyPatternWeek,
  type RepeatConfig,
  type WeekdayName,
} from '../types/recurrence/repeat'

type RecurrenceLike = RecurrenceGroup & {
  interval?: number
  intervalValue?: number
  daysOfWeek?: Week[]
  dayOfWeekInMonth?: RecurrenceGroup['dayOfWeekInMonth']
  isCustom?: boolean
}

// 서버 요일 enum과 폼 요일 키 간 양방향 변환 테이블이다.
const WEEKDAY_MAP: Record<Week, WeekdayName> = {
  SUNDAY: 'sun',
  MONDAY: 'mon',
  TUESDAY: 'tue',
  WEDNESDAY: 'wed',
  THURSDAY: 'thu',
  FRIDAY: 'fri',
  SATURDAY: 'sat',
}

const WEEKDAY_REVERSE_MAP: Record<WeekdayName, Week> = {
  sun: 'SUNDAY',
  mon: 'MONDAY',
  tue: 'TUESDAY',
  wed: 'WEDNESDAY',
  thu: 'THURSDAY',
  fri: 'FRIDAY',
  sat: 'SATURDAY',
}

// 서버 요일 값을 반복 설정 UI에서 사용하는 키로 변환한다.
const toWeekday = (value?: Week | null): WeekdayName | undefined =>
  value ? WEEKDAY_MAP[value] : undefined

// 주간 반복 요일 배열을 UI의 요일 배열 포맷으로 바꾼다.
const toWeekdays = (values?: Week[] | null) =>
  values ? values.map((value) => WEEKDAY_MAP[value]) : []

// API의 weekOfMonth 숫자(-1, 1~5)를 UI 패턴 값('last', '1'~'5')으로 변환한다.
const toPatternWeek = (value?: number | null): MonthlyPatternWeek | undefined => {
  if (!value) return undefined
  if (value <= 0) return 'last'
  const normalized = Math.max(1, Math.min(5, value))
  return String(normalized) as MonthlyPatternWeek
}

// 월간 규칙의 단일 요일 값을 배열 기반 처리 로직과 맞추기 위해 배열로 감싼다.
const toWeekArray = (value?: RecurrenceGroup['dayOfWeekInMonth']): Week[] => {
  if (!value) return []
  return [value]
}

// 월간/연간 규칙(평일/주말/단일요일)을 UI 패턴 day 값으로 통합 변환한다.
const toPatternDayFromRule = (
  rule?: MonthlyWeekDayRule | null,
  value?: RecurrenceGroup['dayOfWeekInMonth'],
): MonthlyPatternDay | undefined => {
  if (rule === 'WEEKDAY') return 'weekday'
  if (rule === 'WEEKEND') return 'weekend'
  if (rule === 'ALL_DAYS') return 'allweek'
  const weekdays = toWeekArray(value)
  if (weekdays.length === 0) return undefined
  return toWeekday(weekdays[0])
}

// UI 요일 키를 서버 요일 enum으로 역변환한다.
const toWeek = (value?: WeekdayName | null): Week | undefined =>
  value ? WEEKDAY_REVERSE_MAP[value] : undefined

// pattern day 값 중 단일 요일만 서버 요일 enum으로 변환한다.
const toWeekFromPatternDay = (value?: MonthlyPatternDay | null): Week | undefined => {
  if (!value) return undefined
  if (value === 'weekday' || value === 'weekend' || value === 'allweek') return undefined
  return toWeek(value as WeekdayName)
}

// UI 요일 배열에서 빈 값을 제거한 뒤 서버 요일 enum 배열로 변환한다.
const toWeeks = (values?: (WeekdayName | undefined)[] | null) =>
  values?.filter(Boolean).map((value) => WEEKDAY_REVERSE_MAP[value as WeekdayName]) ?? []

// 서버 recurrenceGroup을 반복 설정 폼의 RepeatConfig로 변환한다.
export const mapRecurrenceGroupToRepeatConfig = (group?: RecurrenceGroup | null): RepeatConfig => {
  if (!group) {
    return {
      ...defaultRepeatConfig,
      customWeeklyDays: defaultRepeatConfig.customWeeklyDays ?? [],
      customMonthlyDates: defaultRepeatConfig.customMonthlyDates ?? [],
      customYearlyMonths: defaultRepeatConfig.customYearlyMonths ?? [],
    }
  }

  const source = group as RecurrenceLike
  const sourceWeekdayRule = source.weekdayRule
  const interval = source.interval ?? source.intervalValue ?? 1
  const frequency = source.frequency

  const base: RepeatConfig = {
    ...defaultRepeatConfig,
    customWeeklyDays: defaultRepeatConfig.customWeeklyDays ?? [],
    customMonthlyDates: defaultRepeatConfig.customMonthlyDates ?? [],
    customYearlyMonths: defaultRepeatConfig.customYearlyMonths ?? [],
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
    const weeklyDays = toWeekdays(source.daysOfWeek)
    base.customWeeklyDays = weeklyDays.length > 0 ? weeklyDays : []
    base.customWeeklyInterval = interval
  }

  if (frequency === 'MONTHLY') {
    base.customMonthlyInterval = interval
    if (source.monthlyType === 'DAY_OF_WEEK') {
      base.customMonthlyMode = 'pattern'
      base.customMonthlyPatternWeek = toPatternWeek(source.weekOfMonth) ?? '1'
      base.customMonthlyPatternDay =
        toPatternDayFromRule(sourceWeekdayRule, source.dayOfWeekInMonth) ?? 'mon'
    } else {
      base.customMonthlyMode = 'dates'
      base.customMonthlyDates = source.daysOfMonth ?? []
    }
  }

  if (frequency === 'YEARLY') {
    base.customYearlyInterval = interval
    base.customYearlyMonths = source.monthOfYear ? [source.monthOfYear] : []
    const yearlyWeek = toPatternWeek(source.weekOfMonth)
    const yearlyDay = toPatternDayFromRule(sourceWeekdayRule, source.dayOfWeekInMonth)
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
  } else if (source.endType === 'NEVER') {
    base.customEndType = 'never'
    base.customEndDate = ''
    base.customEndCount = undefined
  } else {
    base.customEndType = 'until'
    base.customEndDate = ''
  }

  return base
}

// 반복 설정 폼 값을 서버 전송용 recurrenceGroup DTO로 변환한다.
export const mapRepeatConfigToRecurrenceGroup = (
  config?: RepeatConfig | null,
): RecurrenceGroup | null => {
  if (!config || config.repeatType === 'none') return null

  const basis = config.repeatType === 'custom' ? config.customBasis : config.repeatType

  const frequency =
    basis === 'daily'
      ? 'DAILY'
      : basis === 'weekly'
        ? 'WEEKLY'
        : basis === 'monthly'
          ? 'MONTHLY'
          : 'YEARLY'

  const base: RecurrenceGroup = {
    frequency,
    endType: 'NEVER',
    intervalValue: 1,
  }

  if (basis === 'daily') {
    base.intervalValue = config.customDailyInterval ?? 1
  }

  if (basis === 'weekly') {
    base.intervalValue = config.customWeeklyInterval ?? 1
    base.daysOfWeek = toWeeks(config.customWeeklyDays)
  }

  if (basis === 'monthly') {
    base.intervalValue = config.customMonthlyInterval ?? 1
    if (config.customMonthlyMode === 'pattern') {
      base.monthlyType = 'DAY_OF_WEEK'
      base.weekOfMonth =
        config.customMonthlyPatternWeek === 'last' ? -1 : Number(config.customMonthlyPatternWeek)
      const patternDay = config.customMonthlyPatternDay
      if (patternDay === 'weekday') {
        base.weekdayRule = 'WEEKDAY'
      } else if (patternDay === 'weekend') {
        base.weekdayRule = 'WEEKEND'
      } else if (patternDay === 'allweek') {
        base.weekdayRule = 'ALL_DAYS'
      } else {
        const weekday = toWeekFromPatternDay(patternDay) ?? 'MONDAY'
        base.weekdayRule = 'SINGLE'
        base.dayOfWeekInMonth = weekday
      }
    } else {
      base.monthlyType = 'DAY_OF_MONTH'
      base.daysOfMonth = (config.customMonthlyDates ?? []).filter(Boolean) as number[]
    }
  }

  if (basis === 'yearly') {
    base.intervalValue = config.customYearlyInterval ?? 1
    base.monthOfYear = (config.customYearlyMonths ?? []).filter(Boolean)[0]
    if (config.customYearlyConditionEnabled) {
      base.weekOfMonth =
        config.customYearlyConditionWeek === 'last' ? -1 : Number(config.customYearlyConditionWeek)
      const conditionDay = config.customYearlyConditionDay
      if (conditionDay === 'weekday') {
        base.weekdayRule = 'WEEKDAY'
        base.dayOfWeekInMonth = null
      } else if (conditionDay === 'weekend') {
        base.weekdayRule = 'WEEKEND'
        base.dayOfWeekInMonth = null
      } else if (conditionDay === 'allweek') {
        base.weekdayRule = 'ALL_DAYS'
        base.dayOfWeekInMonth = null
      } else {
        const weekday = toWeekFromPatternDay(conditionDay) ?? 'MONDAY'
        base.weekdayRule = 'SINGLE'
        base.dayOfWeekInMonth = weekday
      }
    }
  }

  if (config.customEndType === 'count' && config.customEndCount) {
    base.endType = 'END_BY_COUNT'
    base.occurrenceCount = config.customEndCount
  } else if (config.customEndType === 'until' && config.customEndDate) {
    base.endType = 'END_BY_DATE'
    base.endDate = config.customEndDate
  } else if (config.customEndType === 'never') {
    base.endType = 'NEVER'
  }

  return base
}
