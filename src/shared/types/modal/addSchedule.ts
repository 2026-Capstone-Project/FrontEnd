import type { ReactNode } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { EventColorType } from '@/shared/types/event/event'

export type AddScheduleFormProps = {
  registerDeleteHandler?: (handler?: () => void) => void
  registerCloseGuard?: (guard?: (() => boolean) | null) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  modalWrapperElement?: HTMLDivElement | null
  date: string
  mode?: 'modal' | 'inline'
  eventId: CalendarEvent['id']
  onClose: () => void
  isEditing?: boolean
  headerTitlePortalTarget?: HTMLElement | null
  initialEvent?: CalendarEvent | null
  onEventColorChange?: (eventId: CalendarEvent['id'], color: EventColorType) => void
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: string) => void
  onEventTimingChange?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
  ) => void
}
