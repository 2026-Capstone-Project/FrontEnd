import type { TCommonResponse } from '../common/common'
import type { BriefingTime } from '../settings/settings'
export type BriefingReason = 'AVAILABLE' | 'DISABLED' | 'TIME_NOT_REACHED' | 'NOT_EVENT_TODAY'

export type TargetType = 'EVENT' | 'TODO'

export type BriefTime = BriefingTime

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

export interface Reminder {
  id: number
  reminderTime: string
  time: string
  title: string
  message: string
}

export type ReminderResponse = TCommonResponse<Reminder[]>
