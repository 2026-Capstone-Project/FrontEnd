import type { Week } from '../event'

export interface RecurrenceGroup {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  endType: 'NEVER' | 'END_BY_DATE' | 'END_BY_COUNT'
  endDate?: string
  occurrenceCount?: number
  intervalValue?: number
  dayOfWeek?: Array<Week>
  daysOfWeek?: Array<Week>
  monthlyType?: 'DAY_OF_MONTH' | 'DAY_OF_WEEK'
  daysOfMonth?: Array<number>
  weekOfMonth?: number
  dayOfWeekInMonth?: Array<Week>
  monthOfYear?: number
}
