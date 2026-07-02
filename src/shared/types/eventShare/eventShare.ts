import type { TCommonResponse } from '../common/common'

export interface SharedEvent {
  eventId: number
  ownerName: string
  title: string
  startDate: string
  endDate: string
}

export interface SharedEventsResult {
  sharedEvents: SharedEvent[]
}

export type SharedEventsApiResponse = TCommonResponse<SharedEventsResult>

export interface Invitation {
  participantId: number
  ownerName: string
  title: string
  createdAt: string
  startDate: string
  endDate: string
  location: string
  participantCount: number
}

export interface InvitationsResult {
  invitations: Invitation[]
}

export type InvitationsApiResponse = TCommonResponse<InvitationsResult>

export type ActionApiResponse = TCommonResponse<null>
