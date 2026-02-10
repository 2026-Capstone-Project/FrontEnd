import { deleteEvent, patchEvent, postEvents } from '@/shared/api/calendar/api'

import { useCustomMutation } from '../common/customQuery'

export function useCalendarMutation() {
  function usePostEvent() {
    return useCustomMutation(postEvents)
  }
  function usePatchEvent() {
    return useCustomMutation(
      ({ eventId, eventData }: { eventId: number; eventData: Parameters<typeof patchEvent>[1] }) =>
        patchEvent(eventId, eventData),
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
          scope?: 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS' | 'ALL_EVENTS'
          occurrenceDate?: string
        }
      }) => deleteEvent(eventId, params),
    )
  }
  return {
    usePostEvent,
    usePatchEvent,
    useDeleteEvent,
  }
}
