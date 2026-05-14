import { friendKeys } from '@/shared/api/queryKeys'
import { useCustomQuery } from '@/shared/hooks/common/customQuery'

export function useFriendSearchQuery(keyword: string, enabled = true) {
  const query = friendKeys.search(keyword)
  return useCustomQuery(query.queryKey, query.queryFn, { enabled })
}
