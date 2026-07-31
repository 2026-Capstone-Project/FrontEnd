import type {
  ActionApiResponse,
  InvitationsApiResponse,
  LeaveEventResponse,
  SharedEventsApiResponse,
} from '@/shared/types/eventShare/eventShare'

import axiosInstance from '../axios'

const BASE_URL = '/event-participant'

export const eventShareApi = {
  rejectInvitation: async (eventParticipantId: number): Promise<ActionApiResponse> => {
    const { data } = await axiosInstance.post<ActionApiResponse>(
      `${BASE_URL}/${eventParticipantId}/rejection`,
    )
    return data
  },

  acceptInvitation: async (eventParticipantId: number): Promise<ActionApiResponse> => {
    const { data } = await axiosInstance.post<ActionApiResponse>(
      `${BASE_URL}/${eventParticipantId}/acceptance`,
    )
    return data
  },

  getSharedEvents: async (): Promise<SharedEventsApiResponse> => {
    const { data } = await axiosInstance.get<SharedEventsApiResponse>(`${BASE_URL}/shared-events`)
    return data
  },

  getInvitations: async (): Promise<InvitationsApiResponse> => {
    const { data } = await axiosInstance.get<InvitationsApiResponse>(`${BASE_URL}/invitations`)
    return data
  },
  deleteEventParticipants: async (eventId: number): Promise<LeaveEventResponse> => {
    const { data } = await axiosInstance.delete<LeaveEventResponse>(
      `/events/${eventId}/participants`,
    )
    return data
  },
  leaveEvent: async (eventId: number): Promise<LeaveEventResponse> => {
    const { data } = await axiosInstance.delete<LeaveEventResponse>(
      `/events/${eventId}/participants/leave`,
    )
    return data
  },
}
