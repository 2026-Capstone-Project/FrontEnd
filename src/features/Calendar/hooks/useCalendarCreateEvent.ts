import moment from 'moment'
import { useCallback } from 'react'
import type { SlotInfo, View } from 'react-big-calendar'
import { Views } from 'react-big-calendar'

import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'

type UseCalendarCreateEventArgs = {
  view: View
  onCreated: (start: Date, nextId: number) => void
  refetchEvents: () => void
}

// 슬롯 더블클릭 시 기본 일정 생성 + 서버 요청을 담당하는 훅
export const useCalendarCreateEvent = ({
  view,
  onCreated,
  refetchEvents,
}: UseCalendarCreateEventArgs) => {
  const { usePostEvent } = useCalendarMutation()
  const { mutate: postEventMutate } = usePostEvent()

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      const isWeekSingleClick =
        view === Views.WEEK && slotInfo.action === 'select' && slotInfo.slots.length === 1
      if (slotInfo.action !== 'doubleClick' && !isWeekSingleClick) return false

      const start = moment(slotInfo.start)
        .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
        .toDate()
      const end = moment(slotInfo.start)
        .set({ hour: 10, minute: 0, second: 0, millisecond: 0 })
        .toDate()

      postEventMutate(
        {
          title: '새 일정',
          content: '',
          startTime: moment(start).format('YYYY-MM-DDTHH:mm'),
          endTime: moment(end).format('YYYY-MM-DDTHH:mm'),
          isAllDay: false,
        },
        {
          onSuccess: (response) => {
            const nextId = response?.result?.id ?? response?.id
            if (typeof nextId === 'number') {
              refetchEvents()
              onCreated(start, nextId)
            }
          },
        },
      )

      return true
    },
    [onCreated, postEventMutate, refetchEvents, view],
  )

  return { handleSelectSlot }
}
