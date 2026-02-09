export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
export type CustomRepeatBasis = 'daily' | 'weekly' | 'monthly' | 'yearly'
export type WeekdayName = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
export type MonthlyPatternWeek = '1' | '2' | '3' | '4' | '5' | 'last'
export type MonthlyPatternDay = WeekdayName | 'weekday' | 'weekend' | 'allweek'
export type RepeatTermination = 'until' | 'count'

export interface RepeatConfig {
  repeatType: RepeatType
  customBasis?: CustomRepeatBasis | null
  customDailyInterval?: number
  customWeeklyDays?: (WeekdayName | undefined)[]
  customMonthlyInterval?: number
  customMonthlyMode?: 'dates' | 'pattern'
  customMonthlyDates?: (number | undefined)[]
  customMonthlyPatternWeek?: MonthlyPatternWeek
  customMonthlyPatternDay?: MonthlyPatternDay
  customYearlyInterval?: number
  customYearlyMonths?: (number | undefined)[]
  customYearlyConditionEnabled?: boolean
  customYearlyConditionWeek?: MonthlyPatternWeek
  customYearlyConditionDay?: MonthlyPatternDay
  customEndType?: RepeatTermination
  customEndDate?: string
  customEndCount?: number
}

export const defaultRepeatConfig: RepeatConfig = {
  repeatType: 'none',
  customBasis: null,
  customDailyInterval: 1,
  customWeeklyDays: [],
  customMonthlyInterval: 1,
  customMonthlyMode: 'dates',
  customMonthlyDates: [],
  customMonthlyPatternWeek: '1',
  customMonthlyPatternDay: 'mon',
  customYearlyInterval: 1,
  customYearlyMonths: [],
  customYearlyConditionEnabled: false,
  customYearlyConditionWeek: '1',
  customYearlyConditionDay: 'mon',
  customEndType: 'until',
  customEndDate: '',
  customEndCount: undefined,
}
export const REPEAT_TYPES: RepeatType[] = ['none', 'daily', 'weekly', 'monthly', 'yearly', 'custom']
export const WEEKDAY_NAMES: WeekdayName[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const MONTHLY_WEEK_OPTIONS: MonthlyPatternWeek[] = ['1', '2', '3', '4', '5', 'last']
export const MONTHLY_DAY_OPTIONS: MonthlyPatternDay[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
  'weekday',
  'weekend',
  'allweek',
]
export const TERMINATION_TYPES: RepeatTermination[] = ['until', 'count']
