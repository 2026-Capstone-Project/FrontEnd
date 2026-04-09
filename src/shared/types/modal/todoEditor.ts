import type { ReactNode } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'

export type TodoEditorFormProps = {
  registerDeleteHandler?: (handler?: () => void) => void
  registerCloseGuard?: (guard?: (() => boolean) | null) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: CalendarEvent['id']
  onClose: () => void
  isEditing?: boolean
  initialEvent?: CalendarEvent | null
  headerTitlePortalTarget?: HTMLElement | null
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: string) => void
  onEventColorChange?: (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => void
  onEventTimingChange?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
    occurrenceDate?: CalendarEvent['occurrenceDate'],
  ) => void
  draftValues?: ItemEditorDraft | null
  onDraftChange?: (draft: ItemEditorDraft) => void
}
