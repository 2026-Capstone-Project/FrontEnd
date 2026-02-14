import { useQueryClient } from '@tanstack/react-query'

import { deleteEvent, patchEvent, postEvents } from '@/shared/api/calendar/api'
import type { RecurrenceEventScope } from '@/shared/types/recurrence/recurrence'

import { useCustomMutation } from '../common/customQuery'

export function useCalendarMutation() {
  const queryClient = useQueryClient()
  const invalidateCalendarQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] })
    queryClient.invalidateQueries({ queryKey: ['calendar', 'detail'] })
  }
  function usePostEvent() {
    return useCustomMutation(postEvents, {
      onSuccess: () => {
        invalidateCalendarQueries()
      },
    })
  }
  function usePatchEvent() {
    return useCustomMutation(
      ({ eventId, eventData }: { eventId: number; eventData: Parameters<typeof patchEvent>[1] }) =>
        patchEvent(eventId, eventData),
      {
        onSuccess: () => {
          invalidateCalendarQueries()
        },
      },
    )
  }
  function useDeleteEvent() {
    return useCustomMutation(
      ({
        eventId,
        params,
      }: {
        eventId: number
        params: {
          scope?: RecurrenceEventScope
          occurrenceDate: string
        }
      }) => deleteEvent(eventId, params),
      {
        onSuccess: () => {
          invalidateCalendarQueries()
        },
      },
    )
  }
  return {
    usePostEvent,
    usePatchEvent,
    useDeleteEvent,
  }
}
