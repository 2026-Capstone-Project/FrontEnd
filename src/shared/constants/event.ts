import type {
  CustomRepeatBasis,
  MonthlyPatternDay,
  MonthlyPatternWeek,
  RepeatType,
  WeekdayName,
} from '@/shared/types/repeat'

import type { EventColorType } from '../types/event'

export const MAIN_OPTIONS: { type: RepeatType; label: string }[] = [
  { type: 'daily', label: '매일' },
  { type: 'weekly', label: '매주' },
  { type: 'monthly', label: '매월' },
  { type: 'yearly', label: '매년' },
  { type: 'custom', label: '사용자 지정' },
]

export const WEEKDAYS: { key: WeekdayName; label: string }[] = [
  { key: 'mon', label: '월' },
  { key: 'tue', label: '화' },
  { key: 'wed', label: '수' },
  { key: 'thu', label: '목' },
  { key: 'fri', label: '금' },
  { key: 'sat', label: '토' },
  { key: 'sun', label: '일' },
]

export const MONTHS = Array.from({ length: 12 }, (_, idx) => idx + 1)
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

export const CUSTOM_BASIS_OPTIONS: CustomRepeatBasis[] = ['daily', 'weekly', 'monthly', 'yearly']
export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토']
export const EVENT_COLORS: EventColorType[] = ['sky', 'mint', 'pink', 'violet', 'gray', 'yellow']
