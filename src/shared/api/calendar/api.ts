import axiosInstance from '@/shared/api/axios'
import type { GetEventDetailResponseDTO, GetEventsResponseDTO } from '@/shared/types/calendar/types'
import type { TCommonResponse, TitleHistoryResponseDTO } from '@/shared/types/common/common'
import type { EventColorType } from '@/shared/types/event/event'
import type { RecurrenceEventScope, RecurrenceGroup } from '@/shared/types/recurrence/recurrence'
import type { GetTodoForCalendarResponseDTO } from '@/shared/types/todo/types'

export const getEvents = async ({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}): Promise<TCommonResponse<GetEventsResponseDTO>> => {
  const { data } = await axiosInstance.get('/events', {
    params: { startDate, endDate },
  })
  return data
}

export const getDetailEvent = async (
  eventId: number,
  occurrenceDate: string,
): Promise<TCommonResponse<GetEventDetailResponseDTO>> => {
  const { data } = await axiosInstance.get(`/events/${eventId}`, {
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
  address?: string | null
  color?: EventColorType
  isAllDay?: boolean
  recurrenceGroup?: RecurrenceGroup
}) => {
  const { data } = await axiosInstance.post('/events', eventData)
  return data
}

export const patchEvent = async (
  eventId: number,
  eventData: {
    title?: string
    content?: string
    location?: string
    address?: string | null
    startTime?: string
    endTime?: string
    color?: EventColorType
    isAllDay?: boolean
    recurrenceGroup?: RecurrenceGroup | null
  },
  params: {
    occurrenceDate: string
    scope?: Extract<RecurrenceEventScope, 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS'>
  },
) => {
  const { data } = await axiosInstance.patch(`/events/${eventId}`, eventData, { params })
  return data
}

export const deleteEvent = async (
  eventId: number,
  params: {
    occurrenceDate: string
    scope?: Extract<RecurrenceEventScope, 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS'>
  },
) => {
  const { data } = await axiosInstance.delete(`/events/${eventId}`, { params })
  return data
}

export const getTodoForCalendar = async (
  startDate: string,
  endDate: string,
): Promise<TCommonResponse<GetTodoForCalendarResponseDTO>> => {
  const { data } = await axiosInstance.get(`/todos/calendar`, {
    params: { startDate, endDate },
  })
  return data
}

export const getEventTitleHistory = async (
  keyword?: string,
): Promise<TCommonResponse<TitleHistoryResponseDTO>> => {
  const normalizedKeyword = keyword?.trim()
  const { data } = await axiosInstance.get('/events/history/titles', {
    params: {
      keyword: normalizedKeyword || undefined,
    },
  })
  return data
}
