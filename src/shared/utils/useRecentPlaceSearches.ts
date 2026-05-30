import { useCallback, useState } from 'react'

import {
  MAX_RECENT_SEARCHES,
  readRecentSearches,
  writeRecentSearches,
} from '@/shared/utils/searchPlace'

const useRecentPlaceSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>(() => readRecentSearches())

  const saveRecentSearch = useCallback((value: string) => {
    setRecentSearches((previous) => {
      const next = [value, ...previous.filter((item) => item !== value)].slice(
        0,
        MAX_RECENT_SEARCHES,
      )

      writeRecentSearches(next)
      return next
    })
  }, [])

  const removeRecentSearch = useCallback((value: string) => {
    setRecentSearches((previous) => {
      const next = previous.filter((item) => item !== value)
      writeRecentSearches(next)
      return next
    })
  }, [])

  return {
    recentSearches,
    removeRecentSearch,
    saveRecentSearch,
  }
}

export default useRecentPlaceSearches
