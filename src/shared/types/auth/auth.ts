import type { TCommonResponse } from '../common/common'

export type SocialProvider = 'KAKAO' | 'GOOGLE' | 'NAVER'

export interface userInfo {
  memberId: number
  nickname: string
  email: string
  provider: SocialProvider
}

export type UserResponse = TCommonResponse<userInfo>
