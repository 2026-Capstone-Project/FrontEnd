import axiosInstance from '@/shared/api/axios'
import type { GetEventDetailResponseDTO, GetEventsResponseDTO } from '@/shared/types/calendar/types'
import type { TCommonResponse } from '@/shared/types/common/common'
import type { EventColorType } from '@/shared/types/event/event'
import type { RecurrenceGroup } from '@/shared/types/event/recurrence/recurrence'

export const getEvents = async ({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}): Promise<TCommonResponse<GetEventsResponseDTO>> => {
  const { data } = await axiosInstance.get('/api/v1/events', {
    params: { startDate, endDate },
  })
  return data
}

export const getDetailEvent = async (
  eventId: number,
  occurrenceDate: string,
): Promise<TCommonResponse<GetEventDetailResponseDTO>> => {
  const { data } = await axiosInstance.get(`/api/v1/events/${eventId}`, {
    params: { occurrenceDate },
  })
  return data
}

export const postEvents = async (eventData: {
  title: string
  content?: string
  startTime: string
  endTime: string
  location?: string
  color?: EventColorType
  isAllDay?: boolean
  recurrenceGroup?: RecurrenceGroup
}) => {
  const { data } = await axiosInstance.post('/api/v1/events', eventData)
  return data
}

export const patchEvent = async (
  eventId: number,
  eventData: {
    title?: string
    content?: string
    startTime?: string
    endTime?: string
    color?: EventColorType
    isAllDay?: boolean
    recurrenceUpdateScope?: 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS' | 'ALL_EVENTS'
    occurrenceDate?: string
    recurrenceGroup?: RecurrenceGroup | null
  },
) => {
  const { data } = await axiosInstance.patch(`/api/v1/events/${eventId}`, eventData)
  return data
}

export const deleteEvent = async (
  eventId: number,
  params: {
    occurrenceDate?: string
    scope?: 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS' | 'ALL_EVENTS'
  },
) => {
  const { data } = await axiosInstance.delete(`/api/v1/events/${eventId}`, { params })
  return data
}
