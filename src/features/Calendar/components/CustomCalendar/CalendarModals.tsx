import moment from 'moment'
import { useMemo } from 'react'
import { createPortal } from 'react-dom'

import { useDetailEventQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { Event } from '@/shared/types/calendar/types'
import AddSchedule from '@/shared/ui/modal/AddSchedule'

import EventsCard from '../EventsCard/EventsCard'

type CalendarModalsProps = {
  modalDate: string
  modalEventId: Event['id'] | null
  modalEvent: Event | null
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
    onEventColorChange: (eventId: Event['id'], color: Event['color']) => void
    onEventTitleConfirm: (eventId: Event['id'], title: Event['title']) => void
    onEventTypeChange: (eventId: Event['id'], type: 'todo' | 'schedule') => void
    onEventTimingChange: (eventId: Event['id'], start: Date, end: Date, allDay: boolean) => void
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
  const detailEvent = useMemo<Event | null>(() => {
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
