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

export interface Suggestion {
  id: number
  content: string
}

export interface SuggestionListResponse {
  isSuccess: boolean
  code: string
  message: string
  result: {
    details: Suggestion[]
  }
}

//챗봇 관련 type
export type ChatActionType = 'CREATED' | 'UPDATED' | 'DELETED' | 'CLARIFYING' | 'NONE'
export type ScheduleType = 'EVENT' | 'TODO'

export interface ChatRequest {
  message: string
}

export interface ChatResponseResult {
  reply: string
  action: ChatActionType
  scheduleId: number | null
  recurrenceGroupId: number | null
  scheduleType: ScheduleType | null
}

export interface ChatResponse {
  isSuccess: boolean
  code: string
  message: string
  result: ChatResponseResult | null
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  action?: ChatActionType
}
