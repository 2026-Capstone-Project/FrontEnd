import moment from 'moment'
import { useMemo, useState } from 'react'

import { useDetailEventQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { RepeatConfigSchema } from '@/shared/types/event/event'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
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

const pad2 = (value: number) => String(value).padStart(2, '0')

const formatTimeFromDate = (value: Date) => `${pad2(value.getHours())}:${pad2(value.getMinutes())}`

const getDefaultDraft = (
  date: string,
  initialType: 'todo' | 'schedule',
  initialEvent?: CalendarEvent | null,
): ItemEditorDraft => {
  const baseStart = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
  const baseEnd =
    initialEvent?.end && new Date(initialEvent.end).getTime() !== baseStart.getTime()
      ? new Date(initialEvent.end)
      : new Date(baseStart.getTime() + 60 * 60 * 1000)

  return {
    title:
      initialType === 'schedule' && initialEvent?.title === '새 일정'
        ? ''
        : (initialEvent?.title ?? ''),
    description: initialEvent?.content ?? '',
    startDate: baseStart,
    endDate: baseEnd,
    startTime: formatTimeFromDate(baseStart),
    endTime: initialType === 'todo' ? formatTimeFromDate(baseStart) : formatTimeFromDate(baseEnd),
    isAllday: initialEvent?.isAllDay ?? false,
    eventColor: initialEvent?.color ?? (initialType === 'todo' ? 'GRAY' : 'BLUE'),
    repeatConfig: defaultRepeatConfig as RepeatConfigSchema,
    location: initialEvent?.location ?? '',
    address: initialEvent?.address ?? null,
  }
}

type DraftBackedModalProps = {
  modalDate: string
  modalEventId: CalendarEvent['id']
  modalEvent: CalendarEvent | null
  detailEvent: CalendarEvent | null
  isModalEditing: boolean
  modalMode: 'modal' | 'inline'
  onCloseModal: () => void
  eventActions: CalendarModalsProps['eventActions']
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
  const isTodoModal = modalEvent?.type === 'todo'
  const activeEvent = detailEvent ?? modalEvent
  const [draftValues, setDraftValues] = useState<ItemEditorDraft | null>(() =>
    isModalEditing
      ? null
      : getDefaultDraft(modalDate, isTodoModal ? 'todo' : 'schedule', activeEvent),
  )

  if (isTodoModal) {
    return (
      <TodoEditorModal
        date={modalDate}
        onClose={onCloseModal}
        mode={modalMode}
        eventId={modalEventId}
        event={modalEvent}
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
      event={detailEvent ?? modalEvent}
      isEditing={isModalEditing}
      showTypeTabs={!isModalEditing}
      draftValues={draftValues}
      onDraftChange={setDraftValues}
      onEventColorChange={eventActions.onEventColorChange}
      onEventTitleConfirm={eventActions.onEventTitleConfirm}
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
