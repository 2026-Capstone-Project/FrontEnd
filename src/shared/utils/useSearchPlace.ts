import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { PlaceResult, UseSearchPlaceParams } from '@/shared/types/schedule/types'
import {
  AUTO_SEARCH_DELAY_MS,
  getPlaceAddressValue,
  getPlaceLocationValue,
  toMarker,
} from '@/shared/utils/searchPlace'

import usePlaceSearch from './usePlaceSearch'
import useRecentPlaceSearches from './useRecentPlaceSearches'
import useSearchPlacePanelModel from './useSearchPlacePanelModel'

const useSearchPlace = ({
  onSelectLocation,
  selectedLocation = '',
  isKakaoLoading,
  kakaoAppKey,
}: UseSearchPlaceParams) => {
  const trimmedSelectedLocation = selectedLocation.trim()
  const [keyword, setKeyword] = useState(selectedLocation)
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const restoredLocationRef = useRef('')
  const trimmedKeyword = keyword.trim()
  const { recentSearches, removeRecentSearch, saveRecentSearch } = useRecentPlaceSearches()
  const {
    cancelPendingSearch,
    clearSearch,
    expandResults,
    issue,
    isSearching,
    lastRequestedKeywordRef,
    markTypedLocationSelected,
    places,
    requestedKeyword,
    resultsView,
    searchPlaces,
    searchState,
    selectedPlaceId,
    selectPlaceInSearch,
  } = usePlaceSearch({
    isKakaoLoading,
    kakaoAppKey,
    selectedLocation: trimmedSelectedLocation,
  })
  const markers = useMemo(() => places.map(toMarker), [places])
  const isTypedLocationSelected =
    trimmedKeyword.length > 0 &&
    trimmedKeyword === trimmedSelectedLocation &&
    selectedPlaceId === null
  const {
    panelCaption,
    panelMessage,
    panelPlaces,
    panelTitle,
    showExpandedResults,
    showPreviewResults,
    shouldShowRecentSearches,
  } = useSearchPlacePanelModel({
    places,
    issue,
    recentSearches,
    requestedKeyword,
    resultsView,
    searchState,
    selectedPlaceId,
    trimmedKeyword,
    trimmedSelectedLocation,
  })

  const selectPlace = useCallback(
    (place: PlaceResult) => {
      const nextLocation = getPlaceLocationValue(place)
      const nextAddress = getPlaceAddressValue(place)
      selectPlaceInSearch(place.id)
      setKeyword(nextLocation)
      saveRecentSearch(trimmedKeyword || nextLocation)
      onSelectLocation(nextLocation, { closeAfterSelect: true, address: nextAddress })

      if (!map) return
      map.panTo(new kakao.maps.LatLng(Number(place.y), Number(place.x)))
      map.setLevel(3)
    },
    [map, onSelectLocation, saveRecentSearch, selectPlaceInSearch, trimmedKeyword],
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

    markTypedLocationSelected()
    saveRecentSearch(trimmedKeyword)
    onSelectLocation(trimmedKeyword, { closeAfterSelect: true, address: null })
  }, [markTypedLocationSelected, onSelectLocation, saveRecentSearch, trimmedKeyword])

  const handleSubmit = useCallback(() => {
    if (!trimmedKeyword) return

    if (
      lastRequestedKeywordRef.current === trimmedKeyword &&
      (searchState === 'success' || searchState === 'zero')
    ) {
      saveRecentSearch(trimmedKeyword)
      expandResults()
      return
    }

    saveRecentSearch(trimmedKeyword)
    searchPlaces(trimmedKeyword, { view: 'expanded' })
  }, [
    expandResults,
    lastRequestedKeywordRef,
    saveRecentSearch,
    searchPlaces,
    searchState,
    trimmedKeyword,
  ])

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

  const handleKeywordChange = useCallback(
    (nextValue: string) => {
      setKeyword(nextValue)
      clearSearch()
      cancelPendingSearch()
      restoredLocationRef.current = ''
    },
    [cancelPendingSearch, clearSearch],
  )

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
  }, [isKakaoLoading, lastRequestedKeywordRef, map, searchPlaces, trimmedSelectedLocation])

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
  }, [
    isKakaoLoading,
    lastRequestedKeywordRef,
    searchPlaces,
    trimmedKeyword,
    trimmedSelectedLocation,
  ])

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
