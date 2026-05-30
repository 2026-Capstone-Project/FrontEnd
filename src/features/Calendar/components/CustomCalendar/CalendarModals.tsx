import moment from 'moment'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useDetailEventQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import ScheduleEditorModal from '@/shared/ui/Modals/ScheduleEditor'
import TodoEditorModal from '@/shared/ui/Modals/TodoEditor'
import { buildDefaultItemEditorDraft } from '@/shared/utils'

import type { CalendarEventActions } from './CustomCalendar.types'

type CalendarModalsProps = {
  modalDate: string
  modalEventId: CalendarEvent['id'] | null
  modalEvent: CalendarEvent | null
  isModalEditing: boolean
  modalMode: 'modal' | 'inline'
  onCloseModal: () => void
  eventActions: CalendarEventActions
}

type DraftBackedModalProps = {
  modalDate: string
  modalEventId: CalendarEvent['id']
  modalEvent: CalendarEvent | null
  detailEvent: CalendarEvent | null
  isModalEditing: boolean
  modalMode: 'modal' | 'inline'
  onCloseModal: () => void
  eventActions: CalendarEventActions
}

const DraftBackedModal = ({
  modalDate,
  modalEventId,
  modalEvent,
  detailEvent,
  isModalEditing,
  modalMode,
  onCloseModal,
  eventActions,
}: DraftBackedModalProps) => {
  const activeEvent = detailEvent ?? modalEvent
  const isTodoModal = activeEvent?.type === 'todo'
  const [draftValues, setDraftValues] = useState<ItemEditorDraft | null>(() =>
    isModalEditing
      ? null
      : buildDefaultItemEditorDraft(modalDate, isTodoModal ? 'todo' : 'schedule', activeEvent),
  )

  if (isTodoModal) {
    return (
      <TodoEditorModal
        date={modalDate}
        onClose={onCloseModal}
        mode={modalMode}
        eventId={modalEventId}
        event={activeEvent}
        showTypeTabs={!isModalEditing}
        draftValues={draftValues}
        onDraftChange={setDraftValues}
        onEventColorChange={eventActions.onEventColorChange}
        onEventTitleConfirm={eventActions.onEventTitleConfirm}
        onEventTypeChange={eventActions.onEventTypeChange}
        onEventTimingChange={eventActions.onEventTimingChange}
        isEditing={isModalEditing}
      />
    )
  }

  return (
    <ScheduleEditorModal
      date={modalDate}
      onClose={onCloseModal}
      mode={modalMode}
      eventId={modalEventId}
      event={activeEvent}
      isEditing={isModalEditing}
      showTypeTabs={!isModalEditing}
      draftValues={draftValues}
      onDraftChange={setDraftValues}
      onEventColorChange={eventActions.onEventColorChange}
      onEventTitleConfirm={eventActions.onEventTitleConfirm}
      onEventSharedChange={eventActions.onEventSharedChange}
      onEventTypeChange={eventActions.onEventTypeChange}
      onEventTimingChange={eventActions.onEventTimingChange}
    />
  )
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
  const location = useLocation()
  const shouldRenderModal = modalEventId != null && location.pathname.startsWith('/calendar')
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
  const resetKey = `${String(modalEventId ?? 'closed')}::${occurrenceDate}::${isModalEditing ? 'edit' : 'create'}`

  return (
    <>
      {/* ItemEditorModal 내부 포털을 그대로 사용해, 리사이즈 시 같은 폼 상태로 루트만 이동합니다. */}
      {shouldRenderModal && modalEventId != null && (
        <DraftBackedModal
          key={resetKey}
          modalDate={modalDate}
          modalEventId={modalEventId}
          modalEvent={modalEvent}
          detailEvent={detailEvent}
          isModalEditing={isModalEditing}
          modalMode={modalMode}
          onCloseModal={onCloseModal}
          eventActions={eventActions}
        />
      )}
    </>
  )
}

export default CalendarModals
