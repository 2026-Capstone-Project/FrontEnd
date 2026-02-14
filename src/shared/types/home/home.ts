import type { TCommonResponse } from '../common/common'
export type BriefingReason = 'AVAILABLE' | 'DISABLED' | 'NOT_EVENT_TODAY'

export type TargetType = 'EVENT' | 'TODO'

export interface BriefTime {
  hour: number
  minute: number
  second: number
  nano: number
}

export interface BriefItem {
  targetType: TargetType
  startTime: string
  title: string
}

export interface BriefingResult {
  date: string
  reason: BriefingReason
  briefInfo: BriefItem[] | null
  eventCount: number
  toDoCount: number
}

export type BriefingResponse = TCommonResponse<BriefingResult>

//리마인더 타입 시작 지점
export interface Reminder {
  id: number
  reminderTime: string
  time: string
  title: string
  message: string
}

export type ReminderResponse = TCommonResponse<Reminder[]>
