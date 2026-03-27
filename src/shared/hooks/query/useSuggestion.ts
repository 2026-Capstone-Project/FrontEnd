import { useMutation, useQueryClient } from '@tanstack/react-query'

import { suggestionApi } from '@/shared/api/home/home'
import { suggestionKeys } from '@/shared/keys/suggestionkey'

import { useCustomQuery } from '../common/customQuery'

export const useSuggestions = () => {
  const queryClient = useQueryClient()

  const { data: suggestions = [] } = useCustomQuery(
    suggestionKeys.lists(),
    suggestionApi.getSuggestions,
    {
      select: (response) => response.result.details,
      refetchInterval: 60000,
    },
  )

  const { mutate: handleAccept } = useMutation({
    mutationFn: suggestionApi.acceptSuggestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: suggestionKeys.all }),
  })

  const { mutate: handleReject } = useMutation({
    mutationFn: suggestionApi.rejectSuggestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: suggestionKeys.all }),
  })

  return { suggestions, handleAccept, handleReject }
}
