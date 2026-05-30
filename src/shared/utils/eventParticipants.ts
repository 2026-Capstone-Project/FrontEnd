import type { CalendarEvent } from '@/shared/types/calendar/types'

type EventParticipant = NonNullable<CalendarEvent['eventParticipantInfo']>[number]

export const getEventParticipantFriendId = (participant: EventParticipant) => participant.friendId

export const getEventFriendIds = (event?: CalendarEvent | null) => {
  if (event?.friendIds != null) return event.friendIds

  return (
    event?.eventParticipantInfo
      ?.map(getEventParticipantFriendId)
      .filter((friendId): friendId is number => friendId != null) ?? []
  )
}
