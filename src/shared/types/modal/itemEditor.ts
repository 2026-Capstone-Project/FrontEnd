import type { EventColorType, RepeatConfigSchema } from '@/shared/types/event/event'

export type ItemType = 'todo' | 'schedule'

export type ItemEditorDraft = {
  title: string
  description: string
  startDate: Date | null
  endDate: Date | null
  startTime?: string
  endTime?: string
  isAllday: boolean
  eventColor: EventColorType
  repeatConfig: RepeatConfigSchema
  location: string
  address: string | null
}
