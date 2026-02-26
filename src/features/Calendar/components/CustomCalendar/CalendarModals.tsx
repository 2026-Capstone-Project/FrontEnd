import moment from 'moment'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import { useDetailEventQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import AddSchedule from '@/shared/ui/modal/AddSchedule'
import AddTodo from '@/shared/ui/modal/AddTodo'

type CalendarModalsProps = {
  modalDate: string
  modalEventId: CalendarEvent['id'] | null
  modalEvent: CalendarEvent | null
  isModalEditing: boolean
  isInlineMode: boolean
  modalMode: 'modal' | 'inline'
  modalPortalRoot: HTMLElement | null
  cardPortalRoot: HTMLElement | null
  onCloseModal: () => void
  eventActions: {
    onEventColorChange: (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => void
    onEventTitleConfirm: (eventId: CalendarEvent['id'], title: CalendarEvent['title']) => void
    onEventTypeChange: (eventId: CalendarEvent['id'], type: 'todo' | 'schedule') => void
    onEventTimingChange: (
      eventId: CalendarEvent['id'],
      start: Date,
      end: Date,
      allDay: boolean,
    ) => void
  }
}

const CalendarModals = ({
  modalDate,
  modalEventId,
  modalEvent,
  isModalEditing,
  isInlineMode,
  modalMode,
  modalPortalRoot,
  cardPortalRoot,
  onCloseModal,
  eventActions,
}: CalendarModalsProps) => {
  const shouldRenderModal = modalEventId != null
  const isTodoModal = modalEvent?.type === 'todo'
  const safeDetailEventId = isModalEditing && !isTodoModal ? modalEventId : null
  const occurrenceDate = useMemo(() => {
    if (modalEvent?.occurrenceDate) {
      return moment(modalEvent.occurrenceDate).format('YYYY-MM-DDTHH:mm:ss')
    }
    const base =
      modalEvent?.start instanceof Date
        ? modalEvent.start
        : modalEvent?.start
          ? new Date(modalEvent.start)
          : modalDate
    return base ? moment(base).format('YYYY-MM-DDTHH:mm:ss') : ''
  }, [modalDate, modalEvent])
  const { data } = useDetailEventQuery(safeDetailEventId, occurrenceDate)
  const detailEvent = useMemo<CalendarEvent | null>(() => {
    const result = data?.result
    if (!result) return null
    return {
      ...result,
      id: result.id ?? safeDetailEventId ?? 0,
    }
  }, [data, safeDetailEventId])
  return (
    <>
      {shouldRenderModal &&
        isTodoModal &&
        modalPortalRoot &&
        !isInlineMode &&
        createPortal(
          <AddTodo
            date={modalDate}
            onClose={onCloseModal}
            mode={modalMode}
            eventId={modalEventId}
            tabsVisible={!isModalEditing}
            onEventColorChange={eventActions.onEventColorChange}
            onEventTitleConfirm={eventActions.onEventTitleConfirm}
            onEventTimingChange={eventActions.onEventTimingChange}
            isEditing={isModalEditing}
          />,
          modalPortalRoot,
        )}
      {shouldRenderModal &&
        isTodoModal &&
        isInlineMode &&
        cardPortalRoot &&
        createPortal(
          <AddTodo
            date={modalDate}
            onClose={onCloseModal}
            mode={modalMode}
            eventId={modalEventId}
            tabsVisible={!isModalEditing}
            onEventColorChange={eventActions.onEventColorChange}
            onEventTitleConfirm={eventActions.onEventTitleConfirm}
            onEventTimingChange={eventActions.onEventTimingChange}
            isEditing={isModalEditing}
          />,
          cardPortalRoot,
        )}
      {shouldRenderModal &&
        !isTodoModal &&
        modalPortalRoot &&
        !isInlineMode &&
        createPortal(
          <AddSchedule
            date={modalDate}
            onClose={onCloseModal}
            mode={modalMode}
            eventId={modalEventId}
            event={detailEvent}
            isEditing={isModalEditing}
            tabsVisible={!isModalEditing}
            onEventColorChange={eventActions.onEventColorChange}
            onEventTitleConfirm={eventActions.onEventTitleConfirm}
            onEventTypeChange={eventActions.onEventTypeChange}
            onEventTimingChange={eventActions.onEventTimingChange}
          />,
          modalPortalRoot,
        )}
      {shouldRenderModal &&
        !isTodoModal &&
        isInlineMode &&
        cardPortalRoot &&
        createPortal(
          <AddSchedule
            date={modalDate}
            onClose={onCloseModal}
            mode={modalMode}
            eventId={modalEventId}
            event={detailEvent ?? modalEvent}
            isEditing={isModalEditing}
            tabsVisible={!isModalEditing}
            onEventColorChange={eventActions.onEventColorChange}
            onEventTitleConfirm={eventActions.onEventTitleConfirm}
            onEventTypeChange={eventActions.onEventTypeChange}
            onEventTimingChange={eventActions.onEventTimingChange}
          />,
          cardPortalRoot,
        )}
    </>
  )
}

export default CalendarModals
