import { useCallback, useEffect, useRef, useState } from 'react'

import type {
  PlaceMarker,
  PlaceResult,
  ResultsView,
  SearchPlaceProps,
  SearchState,
} from './SearchPlace.types'
import {
  AUTO_SEARCH_DELAY_MS,
  getPlaceAddressValue,
  getPlaceLocationValue,
  MAX_RECENT_SEARCHES,
  readRecentSearches,
  toMarker,
  writeRecentSearches,
} from './SearchPlace.utils'

type UseSearchPlaceParams = Pick<SearchPlaceProps, 'onSelectLocation' | 'selectedLocation'> & {
  isKakaoLoading: boolean
  kakaoAppKey: string
}

const useSearchPlace = ({
  onSelectLocation,
  selectedLocation = '',
  isKakaoLoading,
  kakaoAppKey,
}: UseSearchPlaceParams) => {
  const trimmedSelectedLocation = selectedLocation.trim()
  const [keyword, setKeyword] = useState(selectedLocation)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [markers, setMarkers] = useState<PlaceMarker[]>([])
  const [places, setPlaces] = useState<PlaceResult[]>([])
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => readRecentSearches())
  const [searchState, setSearchState] = useState<SearchState>('idle')
  const [resultsView, setResultsView] = useState<ResultsView>('hidden')
  const [isSearching, setIsSearching] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const restoredLocationRef = useRef('')
  const lastRequestedKeywordRef = useRef('')
  const requestIdRef = useRef(0)
  const trimmedKeyword = keyword.trim()
  const inlinePlaces = places.slice(0, 4)
  const isTypedLocationSelected =
    trimmedKeyword.length > 0 &&
    trimmedKeyword === trimmedSelectedLocation &&
    selectedPlaceId === null
  const showPreviewResults =
    resultsView === 'inline' && searchState === 'success' && inlinePlaces.length > 0
  const showExpandedResults =
    resultsView === 'expanded' && searchState === 'success' && places.length > 0
  const shouldShowRecentSearches = resultsView === 'hidden' && recentSearches.length > 0
  const hasSelectedPlacePreview =
    resultsView === 'hidden' &&
    searchState === 'success' &&
    selectedPlaceId !== null &&
    trimmedSelectedLocation.length > 0
  const panelTitle = showExpandedResults
    ? '검색 결과'
    : showPreviewResults
      ? '자동 검색'
      : hasSelectedPlacePreview
        ? '선택된 장소'
        : shouldShowRecentSearches
          ? '최근 검색어'
          : trimmedKeyword
            ? '검색 상태'
            : '장소 찾기'
  const panelCaption = showExpandedResults
    ? `${places.length}개`
    : showPreviewResults
      ? `${inlinePlaces.length}개 미리보기`
      : hasSelectedPlacePreview
        ? '지도에 표시 중'
        : shouldShowRecentSearches
          ? `최대 ${MAX_RECENT_SEARCHES}개`
          : null
  const panelMessage =
    resultsView === 'expanded' || resultsView === 'inline'
      ? statusMessage
      : hasSelectedPlacePreview
        ? '현재 선택된 장소를 기준으로 지도를 보여주고 있습니다.'
        : '최근 검색어가 없습니다.'
  const panelPlaces = showExpandedResults ? places : inlinePlaces

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

  const selectPlace = useCallback(
    (place: PlaceResult) => {
      const nextLocation = getPlaceLocationValue(place)
      const nextAddress = getPlaceAddressValue(place)
      setSelectedPlaceId(place.id)
      setKeyword(nextLocation)
      setSearchState('success')
      saveRecentSearch(trimmedKeyword || nextLocation)
      onSelectLocation(nextLocation, { closeAfterSelect: true, address: nextAddress })

      if (!map) return
      map.panTo(new kakao.maps.LatLng(Number(place.y), Number(place.x)))
      map.setLevel(3)
    },
    [map, onSelectLocation, saveRecentSearch, trimmedKeyword],
  )

  const searchPlaces = useCallback(
    (rawKeyword: string, options?: { view?: ResultsView }) => {
      const nextKeyword = rawKeyword.trim()
      const nextView = options?.view ?? 'expanded'

      if (!nextKeyword) {
        setPlaces([])
        setMarkers([])
        setSelectedPlaceId(null)
        setSearchState('idle')
        setResultsView('hidden')
        setStatusMessage('검색어를 입력해주세요.')
        return
      }

      if (!kakaoAppKey) {
        setSearchState('error')
        setResultsView(nextView)
        setStatusMessage('카카오맵 API 키가 설정되지 않았습니다.')
        return
      }

      if (isKakaoLoading || typeof kakao === 'undefined' || !kakao.maps.services) {
        setSearchState('loading')
        setResultsView(nextView)
        setStatusMessage('지도를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
        return
      }

      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      lastRequestedKeywordRef.current = nextKeyword
      setIsSearching(true)
      setSearchState('loading')
      setResultsView(nextView)
      setStatusMessage(`"${nextKeyword}" 검색 중...`)

      const placesService = new kakao.maps.services.Places()
      placesService.keywordSearch(nextKeyword, (result, status) => {
        if (requestId !== requestIdRef.current) return

        setIsSearching(false)

        if (status === kakao.maps.services.Status.OK) {
          const nextMarkers = result.map(toMarker)
          const matchedPlace = result.find(
            (place) => getPlaceLocationValue(place) === trimmedSelectedLocation,
          )

          setPlaces(result)
          setMarkers(nextMarkers)
          setSelectedPlaceId(matchedPlace?.id ?? null)
          setSearchState('success')
          setStatusMessage(
            nextView === 'expanded'
              ? `${result.length}개의 장소를 찾았습니다.`
              : `${result.length}개 장소가 검색되었습니다.`,
          )
          return
        }

        setPlaces([])
        setMarkers([])
        setSelectedPlaceId(null)

        if (status === kakao.maps.services.Status.ZERO_RESULT) {
          setSearchState('zero')
          setStatusMessage('검색 결과가 없습니다.')
          return
        }

        setSearchState('error')
        setStatusMessage('장소 검색 중 오류가 발생했습니다. 다시 시도해주세요.')
      })
    },
    [isKakaoLoading, kakaoAppKey, trimmedSelectedLocation],
  )

  useEffect(() => {
    if (!map || markers.length === 0 || typeof kakao === 'undefined') return

    const bounds = new kakao.maps.LatLngBounds()

    markers.forEach((marker) => {
      bounds.extend(new kakao.maps.LatLng(marker.position.lat, marker.position.lng))
    })

    map.setBounds(bounds)
  }, [map, markers])

  const handleUseTypedLocation = useCallback(() => {
    if (!trimmedKeyword) return

    setSelectedPlaceId(null)
    setSearchState('zero')
    setResultsView('hidden')
    saveRecentSearch(trimmedKeyword)
    onSelectLocation(trimmedKeyword, { closeAfterSelect: true, address: null })
  }, [onSelectLocation, saveRecentSearch, trimmedKeyword])

  const handleSubmit = useCallback(() => {
    if (!trimmedKeyword) return

    if (
      lastRequestedKeywordRef.current === trimmedKeyword &&
      (searchState === 'success' || searchState === 'zero')
    ) {
      saveRecentSearch(trimmedKeyword)
      setResultsView('expanded')
      return
    }

    saveRecentSearch(trimmedKeyword)
    searchPlaces(trimmedKeyword, { view: 'expanded' })
  }, [saveRecentSearch, searchPlaces, searchState, trimmedKeyword])

  const handleMarkerClick = useCallback(
    (markerId: string) => {
      const place = places.find((item) => item.id === markerId)
      if (!place) return
      selectPlace(place)
    },
    [places, selectPlace],
  )

  const handleRecentSearchClick = useCallback(
    (value: string) => {
      setKeyword(value)
      saveRecentSearch(value)
      searchPlaces(value, { view: 'expanded' })
    },
    [saveRecentSearch, searchPlaces],
  )

  const handleKeywordChange = useCallback((nextValue: string) => {
    setKeyword(nextValue)
    setSelectedPlaceId(null)
    setResultsView('hidden')
    setIsSearching(false)
    requestIdRef.current += 1
    restoredLocationRef.current = ''
    lastRequestedKeywordRef.current = ''

    if (nextValue.trim()) {
      setPlaces([])
      setMarkers([])
      setSearchState('idle')
      setStatusMessage('')
      return
    }

    setPlaces([])
    setMarkers([])
    setSearchState('idle')
    setStatusMessage('장소명을 입력해주세요.')
  }, [])

  useEffect(() => {
    if (!map || !trimmedSelectedLocation || isKakaoLoading) return
    if (restoredLocationRef.current === trimmedSelectedLocation) return
    if (lastRequestedKeywordRef.current === trimmedSelectedLocation) {
      restoredLocationRef.current = trimmedSelectedLocation
      return
    }

    const timeoutId = window.setTimeout(() => {
      restoredLocationRef.current = trimmedSelectedLocation
      searchPlaces(trimmedSelectedLocation, { view: 'hidden' })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [isKakaoLoading, map, searchPlaces, trimmedSelectedLocation])

  useEffect(() => {
    if (!trimmedKeyword || isKakaoLoading) return
    if (
      trimmedKeyword === trimmedSelectedLocation &&
      restoredLocationRef.current === trimmedSelectedLocation
    ) {
      return
    }
    if (lastRequestedKeywordRef.current === trimmedKeyword) return

    const timeoutId = window.setTimeout(() => {
      searchPlaces(trimmedKeyword, { view: 'inline' })
    }, AUTO_SEARCH_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [isKakaoLoading, searchPlaces, trimmedKeyword, trimmedSelectedLocation])

  const handleMapCreate = useCallback((createdMap: kakao.maps.Map) => {
    setMap(createdMap)
  }, [])

  return {
    handleKeywordChange,
    handleMapCreate,
    handleMarkerClick,
    handleRecentSearchClick,
    handleSubmit,
    handleUseTypedLocation,
    isSearching,
    isTypedLocationSelected,
    keyword,
    markers,
    panelCaption,
    panelMessage,
    panelPlaces,
    panelTitle,
    recentSearches,
    removeRecentSearch,
    selectedPlaceId,
    showExpandedResults,
    showPreviewResults,
    shouldShowRecentSearches,
    trimmedKeyword,
    selectPlace,
  }
}

export default useSearchPlace
