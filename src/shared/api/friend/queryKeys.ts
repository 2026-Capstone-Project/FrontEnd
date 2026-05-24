import { createQueryKeys } from '@lukemorales/query-key-factory'

import { getFriendSearch } from './api'

export const friendKeys = createQueryKeys('friend', {
  search: (keyword: string) => ({
    queryKey: [{ keyword }],
    queryFn: () => getFriendSearch(keyword),
  }),
})
