import type { ReactNode } from 'react'

import type { Event } from '@/shared/types/calendar/types'
import type { EventColorType } from '@/shared/types/event/event'

export type AddScheduleFormProps = {
  registerDeleteHandler?: (handler?: () => void) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: Event['id']
  onClose: () => void
  isEditing?: boolean
  headerTitlePortalTarget?: HTMLElement | null
  initialEvent?: Event | null
  onEventColorChange?: (eventId: Event['id'], color: EventColorType) => void
  onEventTitleConfirm?: (eventId: Event['id'], title: string) => void
  onEventTimingChange?: (eventId: Event['id'], start: Date, end: Date, allDay: boolean) => void
}
