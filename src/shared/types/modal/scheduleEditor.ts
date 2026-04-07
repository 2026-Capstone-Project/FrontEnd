import type { ReactNode } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { EventColorType } from '@/shared/types/event/event'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'

export type ScheduleEditorFormProps = {
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
    occurrenceDate?: CalendarEvent['occurrenceDate'],
  ) => void
  draftValues?: ItemEditorDraft | null
  onDraftChange?: (draft: ItemEditorDraft) => void
}
