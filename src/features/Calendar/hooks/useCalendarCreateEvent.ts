import moment from 'moment'
import { useCallback } from 'react'
import type { SlotInfo, View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'

import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarCreateEventArgs = {
  view: View
  onCreated: (start: Date, nextId: CalendarEvent['id']) => void
  enqueueEvent: (date: Date, allDay: boolean) => CalendarEvent['id'] | null
  onBeforeCreate?: () => void
}

// 슬롯 더블클릭 시 임시 일정 생성 후 모달 오픈을 담당하는 훅
export const useCalendarCreateEvent = ({
  view,
  onCreated,
  enqueueEvent,
  onBeforeCreate,
}: UseCalendarCreateEventArgs) => {
  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      const isWeekSingleClick =
        view === Views.WEEK && slotInfo.action === 'select' && slotInfo.slots.length === 1
      if (slotInfo.action !== 'doubleClick' && !isWeekSingleClick) return false

      onBeforeCreate?.()
      const start = moment(slotInfo.start)
        .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
        .toDate()
      const createdId = enqueueEvent(start, false)
      if (createdId != null) {
        onCreated(start, createdId)
      }

      return true
    },
    [enqueueEvent, onBeforeCreate, onCreated, view],
  )

  return { handleSelectSlot }
}
