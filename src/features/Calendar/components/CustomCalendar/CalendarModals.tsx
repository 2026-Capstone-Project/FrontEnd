import { createPortal } from 'react-dom'

import type { CalendarEvent } from '@/features/Calendar/domain/types'
import AddSchedule from '@/shared/ui/modal/AddSchedule'

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
  onEventColorChange,
  onEventTitleConfirm,
  onEventTypeChange,
  onEventTimingChange,
}: CalendarModalsProps) => {
  const shouldRenderModal = modalEventId != null
  const shouldRenderEventCard = !isModalOpen && showEventCard

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
            event={modalEvent}
            tabsVisible={!isModalEditing}
            onEventColorChange={onEventColorChange}
            onEventTitleConfirm={onEventTitleConfirm}
            onEventTypeChange={onEventTypeChange}
            onEventTimingChange={onEventTimingChange}
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
            event={modalEvent}
            tabsVisible={!isModalEditing}
            onEventColorChange={onEventColorChange}
            onEventTitleConfirm={onEventTitleConfirm}
            onEventTypeChange={onEventTypeChange}
            onEventTimingChange={onEventTimingChange}
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
