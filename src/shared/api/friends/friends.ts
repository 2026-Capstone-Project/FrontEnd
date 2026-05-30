import type {
  AcceptFriendRequestReq,
  AcceptFriendRequestResponse,
  DeleteFriendReq,
  DeleteFriendResponse,
  GetFriendsResponse,
  GetReceivedFriendRequestsResponse,
  RejectFriendRequestReq,
  RejectFriendRequestResponse,
  SearchFriendsQueryParams,
  SearchFriendsResponse,
  SendFriendRequestReq,
  SendFriendRequestResponse,
  SentFriendRequestResponse,
} from '@/shared/types/friends/friends'

import axiosInstance from '../axios'

export const friendRequestApi = {
  sendRequest: async (body: SendFriendRequestReq): Promise<SendFriendRequestResponse> => {
    const res = await axiosInstance.post<SendFriendRequestResponse>('/friend-requests', body)
    return res.data
  },

  acceptRequest: async ({
    friendRequestId,
  }: AcceptFriendRequestReq): Promise<AcceptFriendRequestResponse> => {
    const res = await axiosInstance.post<AcceptFriendRequestResponse>(
      `/friend-requests/${friendRequestId}/accept`,
    )
    return res.data
  },

  rejectRequest: async ({
    friendRequestId,
  }: RejectFriendRequestReq): Promise<RejectFriendRequestResponse> => {
    const res = await axiosInstance.post<RejectFriendRequestResponse>(
      `/friend-requests/${friendRequestId}/reject`,
    )
    return res.data
  },

  getSentRequests: async (): Promise<SentFriendRequestResponse> => {
    const res = await axiosInstance.get<SentFriendRequestResponse>('/friend-requests/sent')
    return res.data
  },

  getReceivedRequests: async (): Promise<GetReceivedFriendRequestsResponse> => {
    const res = await axiosInstance.get<GetReceivedFriendRequestsResponse>(
      '/friend-requests/received',
    )
    return res.data
  },
}

export const friendApi = {
  getFriends: async (): Promise<GetFriendsResponse> => {
    const res = await axiosInstance.get<GetFriendsResponse>('/friends')
    return res.data
  },

  searchFriends: async (params?: SearchFriendsQueryParams): Promise<SearchFriendsResponse> => {
    const res = await axiosInstance.get<SearchFriendsResponse>('/friends/search', {
      params,
    })
    return res.data
  },

  deleteFriend: async ({ friendId }: DeleteFriendReq): Promise<DeleteFriendResponse> => {
    const res = await axiosInstance.delete<DeleteFriendResponse>(`/friends/${friendId}`)
    return res.data
  },
}
