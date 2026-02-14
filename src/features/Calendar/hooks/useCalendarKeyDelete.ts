import moment from 'moment'
import { useEffect } from 'react'

import { normalizeDate } from '@/features/Calendar/utils/helpers/calendarPageHelpers'
import { getEventOccurrenceKey } from '@/features/Calendar/utils/helpers/dayViewHelpers'
import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarKeyDeleteArgs = {
  isModalOpen: boolean
  date: Date
  events: CalendarEvent[]
  selectedEventId: CalendarEvent['id'] | null
  selectedEventKey: string | null
  selectedDate: Date | null
  onClearSelection: () => void
  onOpenRecurringConfirm: (payload: {
    eventId: CalendarEvent['id']
    title: string
    date: string
  }) => void
  onRemoveEvent: (
    eventId: CalendarEvent['id'],
    occurrenceDate: string,
    isRecurring: boolean,
  ) => void
  onDeleteTodo: (payload: { todoId: number; occurrenceDate: string; scope?: 'THIS_TODO' }) => void
}

// input, textarea, contenteditable 요소에서는 백스페이스로 이벤트 삭제 안되도록 막기
const isEditableTarget = (target: EventTarget | null) => {
  const element = target as HTMLElement | null
  if (!element) return false
  const tagName = element.tagName
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || element.isContentEditable
}

// 모달이 닫힌 상태에서 선택된 이벤트가 있을 때 백스페이스 키로 삭제 처리하는 훅
export const useCalendarKeyDelete = ({
  isModalOpen,
  date,
  events,
  selectedEventId,
  selectedEventKey,
  selectedDate,
  onClearSelection,
  onOpenRecurringConfirm,
  onRemoveEvent,
  onDeleteTodo,
}: UseCalendarKeyDeleteArgs) => {
  useEffect(() => {
    if (isModalOpen) return undefined
    if (selectedEventId == null) return undefined

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Backspace') return
      if (isEditableTarget(event.target)) return

      const selectedEvent =
        selectedEventKey != null
          ? events.find((item) => getEventOccurrenceKey(item) === selectedEventKey)
          : events.find((item) => item.id === selectedEventId)
      if (!selectedEvent) return

      const baseDate =
        selectedDate ?? (selectedEvent.start ? normalizeDate(selectedEvent.start) : new Date(date))
      const isRecurringEvent =
        selectedEvent.type === 'todo'
          ? Boolean(selectedEvent.isRecurring)
          : selectedEvent.recurrenceGroup != null

      event.preventDefault()

      if (selectedEvent.type === 'todo') {
        onDeleteTodo({
          todoId: selectedEvent.id,
          occurrenceDate: moment(baseDate).format('YYYY-MM-DD'),
          scope: isRecurringEvent ? 'THIS_TODO' : undefined,
        })
        onClearSelection()
        return
      }

      if (isRecurringEvent) {
        onOpenRecurringConfirm({
          eventId: selectedEventId,
          title: selectedEvent.title ?? '',
          date: moment(baseDate).format('YYYY-MM-DD'),
        })
        return
      }

      onRemoveEvent(selectedEventId, baseDate.toISOString(), false)
      onClearSelection()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    date,
    events,
    isModalOpen,
    onClearSelection,
    onDeleteTodo,
    onOpenRecurringConfirm,
    onRemoveEvent,
    selectedDate,
    selectedEventId,
    selectedEventKey,
  ])
}
