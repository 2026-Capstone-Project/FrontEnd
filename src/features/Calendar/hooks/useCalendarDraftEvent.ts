import moment from 'moment'
import { useCallback } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarDraftEventArgs = {
  events: CalendarEvent[]
  isModalEditing: boolean
  modal: {
    isOpen: boolean
    eventId: CalendarEvent['id'] | null
  }
  removeEvent: (eventId: CalendarEvent['id']) => void
  handleCloseModal: () => void
  enqueueEvent: (startDate: Date, isAllDay: boolean) => CalendarEvent['id'] | null
  updateEventTiming: (eventId: CalendarEvent['id'], start: Date, end: Date, allDay: boolean) => void
}

export const useCalendarDraftEvent = ({
  events,
  isModalEditing,
  modal,
  removeEvent,
  handleCloseModal,
  enqueueEvent,
  updateEventTiming,
}: UseCalendarDraftEventArgs) => {
  const handleCloseModalWithCleanup = useCallback(() => {
    if (!isModalEditing && modal.eventId != null) {
      removeEvent(modal.eventId)
    }
    handleCloseModal()
  }, [handleCloseModal, isModalEditing, modal.eventId, removeEvent])

  const clearPendingDraftEvent = useCallback(() => {
    if (!modal.isOpen || isModalEditing || modal.eventId == null) return
    removeEvent(modal.eventId)
  }, [isModalEditing, modal.eventId, modal.isOpen, removeEvent])

  const enqueueDraftEvent = useCallback(
    (start: Date, allDay = false) => {
      if (modal.isOpen && !isModalEditing && modal.eventId != null) {
        const draftEvent = events.find((eventItem) => eventItem.id === modal.eventId)
        if (draftEvent) {
          const currentStart = moment(draftEvent.start)
          const currentEnd = moment(draftEvent.end)
          const shouldKeepAllDay = draftEvent.isAllDay ?? allDay
          const durationMs = Math.max(currentEnd.diff(currentStart), 0)
          const nextStart = shouldKeepAllDay ? moment(start).startOf('day') : moment(start)
          const nextEnd = shouldKeepAllDay
            ? (() => {
                const spanDays = Math.max(
                  currentEnd
                    .clone()
                    .startOf('day')
                    .diff(currentStart.clone().startOf('day'), 'days') + 1,
                  1,
                )
                return nextStart
                  .clone()
                  .add(spanDays - 1, 'days')
                  .endOf('day')
              })()
            : nextStart.clone().add(durationMs, 'milliseconds')
          updateEventTiming(draftEvent.id, nextStart.toDate(), nextEnd.toDate(), shouldKeepAllDay)
          return draftEvent.id
        }
      }

      clearPendingDraftEvent()
      return enqueueEvent(start, allDay)
    },
    [
      clearPendingDraftEvent,
      enqueueEvent,
      events,
      isModalEditing,
      modal.eventId,
      modal.isOpen,
      updateEventTiming,
    ],
  )

  return {
    handleCloseModalWithCleanup,
    enqueueDraftEvent,
  }
}
