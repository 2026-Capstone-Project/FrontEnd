import moment from 'moment'
import { useCallback } from 'react'
import type { SlotInfo, View } from 'react-big-calendar'

import { useCalendarCreateEvent } from '@/features/Calendar/hooks'
import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarCreateHandlersArgs = {
  view: View
  enqueueEvent: (startDate: Date, isAllDay: boolean) => CalendarEvent['id'] | null
  onAddEvent: (start?: Date, createdId?: CalendarEvent['id']) => void
  onBeforeCreate?: () => void
  setSelectedDate: (date: Date | null) => void
  setSelectedEventId: (id: CalendarEvent['id'] | null) => void
  setSelectedEventKey: (key: string | null) => void
}

// 생성/슬롯 선택 핸들러를 묶어 제공합니다.
export const useCalendarCreateHandlers = ({
  view,
  enqueueEvent,
  onAddEvent,
  onBeforeCreate,
  setSelectedDate,
  setSelectedEventId,
  setSelectedEventKey,
}: UseCalendarCreateHandlersArgs) => {
  const { handleSelectSlot } = useCalendarCreateEvent({
    view,
    enqueueEvent,
    onBeforeCreate,
    onCreated: (start, nextId) => {
      onAddEvent(start, nextId)
    },
  })

  const handleDayViewCreateEvent = useCallback(
    (slotDate: Date) => {
      onBeforeCreate?.()
      const startBase = moment(slotDate).set({ second: 0, millisecond: 0 })
      const snappedMinute = startBase.minute() < 30 ? 0 : 30
      const start = startBase.set({ minute: snappedMinute }).toDate()
      const createdId = enqueueEvent(start, false)
      if (createdId != null) {
        onAddEvent(start, createdId)
      }
    },
    [enqueueEvent, onAddEvent, onBeforeCreate],
  )

  const handleSelectSlotWrapper = useCallback(
    (slotInfo: SlotInfo) => {
      const handled = handleSelectSlot(slotInfo)
      if (!handled) {
        setSelectedEventId(null)
        setSelectedEventKey(null)
        setSelectedDate(slotInfo.start)
      } else {
        setSelectedDate(slotInfo.start)
      }
    },
    [handleSelectSlot, setSelectedDate, setSelectedEventId, setSelectedEventKey],
  )

  return { handleDayViewCreateEvent, handleSelectSlotWrapper }
}
