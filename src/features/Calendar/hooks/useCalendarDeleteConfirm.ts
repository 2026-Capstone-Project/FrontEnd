import moment from 'moment'
import { useCallback, useState } from 'react'

import type { DeleteConfirmState } from '@/features/Calendar/components/CustomCalendar/CustomCalendar.types'
import { getEventOccurrenceScope } from '@/features/Calendar/utils/helpers/calendarRecurrenceScope'
import type { CalendarEvent } from '@/shared/types/calendar/types'

type UseCalendarDeleteConfirmArgs = {
  events: CalendarEvent[]
  deleteEventMutate: (
    variables: {
      eventId: number
      params: {
        scope?: ReturnType<typeof getEventOccurrenceScope>
        occurrenceDate: string
      }
    },
    options?: {
      onSuccess?: () => void
    },
  ) => void
  refetchEvents: () => void
}

export const useCalendarDeleteConfirm = ({
  events,
  deleteEventMutate,
  refetchEvents,
}: UseCalendarDeleteConfirmArgs) => {
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    isOpen: false,
    eventId: null,
    title: '',
    occurrenceDate: '',
  })

  const handleCloseDeleteConfirm = useCallback(() => {
    setDeleteConfirm({ isOpen: false, eventId: null, title: '', occurrenceDate: '' })
  }, [])

  const openDeleteConfirm = useCallback(
    ({ eventId, title, occurrenceDate }: Omit<DeleteConfirmState, 'isOpen'>) => {
      setDeleteConfirm({
        isOpen: true,
        eventId,
        title,
        occurrenceDate,
      })
    },
    [],
  )

  const isRecurring = useCallback(
    (eventId: CalendarEvent['id']) => {
      const target = events.find((eventItem) => eventItem.id === eventId)
      if (!target) return false
      if (target.type === 'todo') return Boolean(target.isRecurring)
      return target.recurrenceGroup != null
    },
    [events],
  )

  const handleRemoveEvent = useCallback(
    (eventId: CalendarEvent['id'], occurrenceDate: string, isRecurringEvent: boolean) => {
      deleteEventMutate(
        {
          eventId,
          params: {
            ...(isRecurringEvent ? { scope: getEventOccurrenceScope(isRecurringEvent) } : {}),
            occurrenceDate: moment(occurrenceDate).format('YYYY-MM-DDTHH:mm:ss'),
          },
        },
        {
          onSuccess: () => {
            refetchEvents()
          },
        },
      )
    },
    [deleteEventMutate, refetchEvents],
  )

  return {
    deleteConfirm,
    isRecurring,
    handleRemoveEvent,
    openDeleteConfirm,
    handleCloseDeleteConfirm,
  }
}
