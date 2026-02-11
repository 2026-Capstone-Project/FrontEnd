import type { TCommonResponse } from '../common/common'

export type ReminderTiming =
  | 'FIVE_MINUTES'
  | 'FIFTEEN_MINUTES'
  | 'THIRTY_MINUTES'
  | 'ONE_HOUR'
  | 'TWO_HOURS'
  | 'ONE_DAY'
export type CalendarView = 'MONTH' | 'WEEK' | 'DAY'

export interface BriefingTime {
  hour: number
  minute: number
  second: number
  nano: number
}

export interface UserSettings {
  dailyBriefingEnabled: boolean
  dailyBriefingTime: string
  reminderTiming: ReminderTiming
  suggestionEnabled: boolean
  defaultView: CalendarView
}

export type SettingsResponse = TCommonResponse<UserSettings>

export type UpdateSuggestionResponse = TCommonResponse<{ suggestionEnabled: boolean }>

export type UpdateReminderTimingResponse = TCommonResponse<{ reminderTiming: ReminderTiming }>

export type UpdateDefaultViewResponse = TCommonResponse<{ defaultView: CalendarView }>

export type UpdateDailyBriefingResponse = TCommonResponse<{ dailyBriefingEnabled: boolean }>

export type UpdateBriefingTimeResponse = TCommonResponse<{ dailyBriefingTime: BriefingTime }>

export type DeleteMemberResponse = TCommonResponse<null>
