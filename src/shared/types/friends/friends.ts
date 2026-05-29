import type { TCommonResponse } from '../common/common'

export interface IUserInfo {
  name: string
  email: string
}

export interface IFriendIdParam {
  friendId: number
}

export interface IFriendRequestIdParam {
  friendRequestId: number
}

export type SendFriendRequestReq = IUserInfo

export interface SearchFriendsQueryParams {
  keyword?: string
}

export type RejectFriendRequestReq = IFriendRequestIdParam
export type AcceptFriendRequestReq = IFriendRequestIdParam
export type DeleteFriendReq = IFriendIdParam

export interface FriendData {
  id: number
  name: string
  email: string
  info?: string
  avatarColor: string
}

export interface FriendItem {
  id: number
  opponentName: string
  opponentEmail: string
}

export interface SentFriendRequestItem extends IFriendIdParam {
  receiverName: string
  receiverEmail: string
  createdAt: string
}

export interface ReceivedFriendRequestItem {
  id: number
  opponentName: string
  opponentEmail: string
}
export type SendFriendRequestResponse = TCommonResponse<null>
export type RejectFriendRequestResponse = TCommonResponse<null>
export type AcceptFriendRequestResponse = TCommonResponse<null>
export type DeleteFriendResponse = TCommonResponse<null>

export type SentFriendRequestResponse = TCommonResponse<SentFriendRequestItem[]>

export type GetReceivedFriendRequestsResponse = TCommonResponse<{
  friendRequestDetailList: ReceivedFriendRequestItem[]
}>

export type GetFriendsResponse = TCommonResponse<{
  friendDetailList: FriendItem[]
}>

export type SearchFriendsResponse = TCommonResponse<{
  friendDetailList: FriendItem[]
}>

export type FriendApiErrorCode =
  | 'COMMON201'
  | 'COMMON200'
  | 'FRIEND409_1' // 이미 친구이거나 이미 요청됨
  | 'FRIEND403_1' // 친구 요청에 대한 접근 권한 없음
  | 'FRIEND404_1' // 친구 요청을 찾을 수 없음
  | 'FRIEND403_2' // 친구에 대한 접근 권한 없음
  | 'FRIEND404_2' // 친구를 찾을 수 없음
