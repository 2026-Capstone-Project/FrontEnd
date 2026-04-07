import moment from 'moment'
import { useMemo } from 'react'

import { useDetailEventQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import ScheduleEditorModal from '@/shared/ui/Modals/ScheduleEditor'
import TodoEditorModal from '@/shared/ui/Modals/TodoEditor'

type CalendarModalsProps = {
  modalDate: string
  modalEventId: CalendarEvent['id'] | null
  modalEvent: CalendarEvent | null
  isModalEditing: boolean
  modalMode: 'modal' | 'inline'
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
      occurrenceDate?: CalendarEvent['occurrenceDate'],
    ) => void
  }
}

const CalendarModals = ({
  modalDate,
  modalEventId,
  modalEvent,
  isModalEditing,
  modalMode,
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
      {/* ItemEditorModal 내부 포털을 그대로 사용해, 리사이즈 시 같은 폼 상태로 루트만 이동합니다. */}
      {shouldRenderModal && isTodoModal && (
        <TodoEditorModal
          key={`todo-${String(modalEventId)}-${occurrenceDate}-${isModalEditing ? 'edit' : 'create'}`}
          date={modalDate}
          onClose={onCloseModal}
          mode={modalMode}
          eventId={modalEventId}
          event={modalEvent}
          showTypeTabs={!isModalEditing}
          onEventColorChange={eventActions.onEventColorChange}
          onEventTitleConfirm={eventActions.onEventTitleConfirm}
          onEventTypeChange={eventActions.onEventTypeChange}
          onEventTimingChange={eventActions.onEventTimingChange}
          isEditing={isModalEditing}
        />
      )}
      {shouldRenderModal && !isTodoModal && (
        <ScheduleEditorModal
          key={`schedule-${String(modalEventId)}-${occurrenceDate}-${isModalEditing ? 'edit' : 'create'}`}
          date={modalDate}
          onClose={onCloseModal}
          mode={modalMode}
          eventId={modalEventId}
          event={detailEvent ?? modalEvent}
          isEditing={isModalEditing}
          showTypeTabs={!isModalEditing}
          onEventColorChange={eventActions.onEventColorChange}
          onEventTitleConfirm={eventActions.onEventTitleConfirm}
          onEventTypeChange={eventActions.onEventTypeChange}
          onEventTimingChange={eventActions.onEventTimingChange}
        />
      )}
    </>
  )
}

export default CalendarModals
