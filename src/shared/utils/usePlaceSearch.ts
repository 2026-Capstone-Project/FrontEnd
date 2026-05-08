import { useCallback, useReducer, useRef } from 'react'

import type { PlaceResult, ResultsView, SearchState } from '@/shared/types/schedule/types'
import { getPlaceLocationValue } from '@/shared/utils/searchPlace'

type SearchPlacesOptions = {
  view?: ResultsView
}

type PlaceSearchState = {
  issue: 'missing_key' | 'sdk_loading' | 'search_failed' | null
  places: PlaceResult[]
  requestedKeyword: string
  resultsView: ResultsView
  searchState: SearchState
  selectedPlaceId: string | null
}

type PlaceSearchAction =
  | { type: 'clear' }
  | { type: 'expand_results' }
  | { type: 'loading'; view: ResultsView; keyword: string }
  | { type: 'missing_key'; view: ResultsView }
  | { type: 'sdk_loading'; view: ResultsView }
  | { type: 'success'; places: PlaceResult[]; selectedPlaceId: string | null }
  | { type: 'zero_result' }
  | { type: 'error' }
  | { type: 'select_place'; placeId: string }
  | { type: 'use_typed_location' }

const initialPlaceSearchState: PlaceSearchState = {
  issue: null,
  places: [],
  requestedKeyword: '',
  resultsView: 'hidden',
  searchState: 'idle',
  selectedPlaceId: null,
}

const placeSearchReducer = (
  state: PlaceSearchState,
  action: PlaceSearchAction,
): PlaceSearchState => {
  switch (action.type) {
    case 'clear':
      return initialPlaceSearchState
    case 'expand_results':
      return { ...state, resultsView: 'expanded' }
    case 'loading':
      return {
        ...state,
        requestedKeyword: action.keyword,
        resultsView: action.view,
        searchState: 'loading',
        issue: null,
      }
    case 'missing_key':
      return {
        ...state,
        resultsView: action.view,
        searchState: 'error',
        issue: 'missing_key',
      }
    case 'sdk_loading':
      return {
        ...state,
        requestedKeyword: '',
        resultsView: action.view,
        searchState: 'loading',
        issue: 'sdk_loading',
      }
    case 'success':
      return {
        ...state,
        issue: null,
        places: action.places,
        searchState: 'success',
        selectedPlaceId: action.selectedPlaceId,
      }
    case 'zero_result':
      return {
        ...state,
        issue: null,
        places: [],
        searchState: 'zero',
        selectedPlaceId: null,
      }
    case 'error':
      return {
        ...state,
        issue: 'search_failed',
        places: [],
        searchState: 'error',
        selectedPlaceId: null,
      }
    case 'select_place':
      return {
        ...state,
        issue: null,
        searchState: 'success',
        selectedPlaceId: action.placeId,
      }
    case 'use_typed_location':
      return {
        ...state,
        issue: null,
        resultsView: 'hidden',
        searchState: 'zero',
        selectedPlaceId: null,
      }
  }
}

type UsePlaceSearchParams = {
  isKakaoLoading: boolean
  kakaoAppKey: string
  selectedLocation: string
}

const usePlaceSearch = ({
  isKakaoLoading,
  kakaoAppKey,
  selectedLocation,
}: UsePlaceSearchParams) => {
  const [state, dispatch] = useReducer(placeSearchReducer, initialPlaceSearchState)
  const lastRequestedKeywordRef = useRef('')
  const requestIdRef = useRef(0)

  const cancelPendingSearch = useCallback(() => {
    requestIdRef.current += 1
    lastRequestedKeywordRef.current = ''
  }, [])

  const clearSearch = useCallback(() => {
    dispatch({ type: 'clear' })
  }, [])

  const expandResults = useCallback(() => {
    dispatch({ type: 'expand_results' })
  }, [])

  const markTypedLocationSelected = useCallback(() => {
    dispatch({ type: 'use_typed_location' })
  }, [])

  const selectPlaceInSearch = useCallback((placeId: string) => {
    dispatch({ type: 'select_place', placeId })
  }, [])

  const searchPlaces = useCallback(
    (rawKeyword: string, options?: SearchPlacesOptions) => {
      const nextKeyword = rawKeyword.trim()
      const nextView = options?.view ?? 'expanded'

      if (!nextKeyword) {
        dispatch({ type: 'clear' })
        return
      }

      if (!kakaoAppKey) {
        dispatch({ type: 'missing_key', view: nextView })
        return
      }

      if (isKakaoLoading || typeof kakao === 'undefined' || !kakao.maps.services) {
        dispatch({ type: 'sdk_loading', view: nextView })
        return
      }

      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      lastRequestedKeywordRef.current = nextKeyword
      dispatch({ type: 'loading', view: nextView, keyword: nextKeyword })

      const placesService = new kakao.maps.services.Places()
      placesService.keywordSearch(nextKeyword, (result, status) => {
        if (requestId !== requestIdRef.current) return

        if (status === kakao.maps.services.Status.OK) {
          const matchedPlace = result.find(
            (place) => getPlaceLocationValue(place) === selectedLocation,
          )

          dispatch({
            type: 'success',
            places: result,
            selectedPlaceId: matchedPlace?.id ?? null,
          })
          return
        }

        if (status === kakao.maps.services.Status.ZERO_RESULT) {
          dispatch({ type: 'zero_result' })
          return
        }

        dispatch({ type: 'error' })
      })
    },
    [isKakaoLoading, kakaoAppKey, selectedLocation],
  )

  return {
    ...state,
    cancelPendingSearch,
    clearSearch,
    expandResults,
    isSearching: state.searchState === 'loading',
    lastRequestedKeywordRef,
    markTypedLocationSelected,
    searchPlaces,
    selectPlaceInSearch,
  }
}

export default usePlaceSearch
