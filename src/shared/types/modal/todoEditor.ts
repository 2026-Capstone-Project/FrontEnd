import type { ReactNode } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'

export type TodoEditorFormProps = {
  registerDeleteHandler?: (handler?: () => void) => void
  registerCloseGuard?: (guard?: (() => boolean) | null) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: CalendarEvent['id']
  onClose: () => void
  isEditing?: boolean
  headerTitlePortalTarget?: HTMLElement | null
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: string) => void
  onEventColorChange?: (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => void
  onEventTimingChange?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
  ) => void
}
