import type { Week } from '../event/event'

export type MonthlyWeekDayRule = 'SINGLE' | 'WEEKDAY' | 'WEEKEND' | 'ALL_DAYS'

export interface RecurrenceGroup {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  endType: 'NEVER' | 'END_BY_DATE' | 'END_BY_COUNT'
  endDate?: string
  occurrenceCount?: number
  intervalValue?: number
  daysOfWeek?: Array<Week>
  monthlyType?: 'DAY_OF_MONTH' | 'DAY_OF_WEEK'
  weekOfMonth?: number
  daysOfMonth?: Array<number>
  weekdayRule?: MonthlyWeekDayRule
  dayOfWeekInMonth?: Week | null
  monthOfYear?: number
}

export type RecurrenceEventScope = 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS'
export type RecurrenceTodoScope = 'THIS_TODO' | 'THIS_AND_FOLLOWING'
