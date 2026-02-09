import axiosInstance from '@/shared/api/axios'
import type { TCommonResponse } from '@/shared/types/common/common'
import type { recurrenceGroup } from '@/shared/types/event/recurrence/recurrence'

import type { EventColorType } from '../../../features/Calendar/utils/colorPalette'
import type { GetEventDetailResponseDTO, GetEventsResponseDTO } from '../../types/calendar/types'

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
  startDate: string
  endDate: string
  location?: string
  color?: EventColorType
  isAllday?: boolean
  recurrenceGroup?: recurrenceGroup
}) => {
  const { data } = await axiosInstance.post('/api/v1/events', eventData)
  return data
}

export const patchEvent = async (
  eventId: number,
  eventData: {
    title: string
    content: string
    startDate: string
    endDate: string
  },
) => {
  const { data } = await axiosInstance.put(`/api/v1/events/${eventId}`, eventData)
  return data
}
