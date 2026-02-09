import moment from 'moment'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import AddSchedule from '@/shared/ui/modal/AddSchedule'

import { useDetailEventQuery } from '../../../../shared/hooks/query/useCalendarQueries'
import EventsCard from '../EventsCard/EventsCard'

type CalendarModalsProps = {
  modalDate: string
  modalEventId: CalendarEvent['id'] | null
  modalEvent: CalendarEvent | null
  isModalEditing: boolean
  isModalOpen: boolean
  isInlineMode: boolean
  modalMode: 'modal' | 'inline'
  modalPortalRoot: HTMLElement | null
  cardPortalRoot: HTMLElement | null
  eventCardDate: Date
  showEventCard: boolean
  onCloseModal: () => void
  onCloseEventCard: () => void
  eventActions: {
    onEventColorChange: (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => void
    onEventTitleConfirm: (eventId: CalendarEvent['id'], title: CalendarEvent['title']) => void
    onEventTypeChange: (eventId: CalendarEvent['id'], type: CalendarEvent['type']) => void
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
  isModalOpen,
  isInlineMode,
  modalMode,
  modalPortalRoot,
  cardPortalRoot,
  eventCardDate,
  showEventCard,
  onCloseModal,
  onCloseEventCard,
  eventActions,
}: CalendarModalsProps) => {
  const shouldRenderModal = modalEventId != null
  const shouldRenderEventCard = !isModalOpen && showEventCard
  const safeDetailEventId = modalEventId
  const occurrenceDate = useMemo(
    () => (modalDate ? moment(modalDate).format('YYYY-MM-DDTHH:mm') : ''),
    [modalDate],
  )
  const { data } = useDetailEventQuery(safeDetailEventId, occurrenceDate)
  const detailEvent = useMemo<CalendarEvent | null>(() => {
    const result = data?.result
    if (!result) return null
    return {
      id: result.id ?? safeDetailEventId ?? 0,
      title: result.title ?? '',
      start: result.start,
      end: result.end,
      allDay: result.isAllday ?? false,
      type: 'schedule',
      color: result.color ?? 'BLUE',
      location: result.location ?? undefined,
      memo: result.content ?? undefined,
      recurrenceGroup: result.recurrenceGroup ?? null,
    }
  }, [data, safeDetailEventId])
  return (
    <>
      {shouldRenderModal &&
        modalPortalRoot &&
        !isInlineMode &&
        createPortal(
          <AddSchedule
            date={modalDate}
            onClose={onCloseModal}
            mode={modalMode}
            eventId={modalEventId}
            event={detailEvent ?? modalEvent}
            tabsVisible={!isModalEditing}
            onEventColorChange={eventActions.onEventColorChange}
            onEventTitleConfirm={eventActions.onEventTitleConfirm}
            onEventTypeChange={eventActions.onEventTypeChange}
            onEventTimingChange={eventActions.onEventTimingChange}
          />,
          modalPortalRoot,
        )}
      {shouldRenderModal &&
        modalPortalRoot &&
        isInlineMode &&
        cardPortalRoot &&
        createPortal(
          <AddSchedule
            date={modalDate}
            onClose={onCloseModal}
            mode={modalMode}
            eventId={modalEventId}
            event={detailEvent ?? modalEvent}
            tabsVisible={!isModalEditing}
            onEventColorChange={eventActions.onEventColorChange}
            onEventTitleConfirm={eventActions.onEventTitleConfirm}
            onEventTypeChange={eventActions.onEventTypeChange}
            onEventTimingChange={eventActions.onEventTimingChange}
          />,
          cardPortalRoot,
        )}

      {shouldRenderEventCard &&
        !isInlineMode &&
        modalPortalRoot &&
        createPortal(
          <EventsCard onClose={onCloseEventCard} selectedDate={eventCardDate} mode={modalMode} />,
          modalPortalRoot,
        )}

      {shouldRenderEventCard &&
        isInlineMode &&
        cardPortalRoot &&
        createPortal(
          <EventsCard onClose={onCloseEventCard} selectedDate={eventCardDate} mode={modalMode} />,
          cardPortalRoot,
        )}
    </>
  )
}

export default CalendarModals
