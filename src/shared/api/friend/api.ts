import type { TCommonResponse } from '@/shared/types/common/common'
import type { FriendDetail } from '@/shared/types/friend/types'

import axiosInstance from '../axios'

export const getFriendSearch = async (
  keyword: string,
): Promise<TCommonResponse<{ friendDetailList: FriendDetail[] }>> => {
  const { data } = await axiosInstance.get('/friends/search', {
    params: {
      keyword,
    },
  })
  return data
}
