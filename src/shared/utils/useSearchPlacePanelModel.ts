import { useMemo } from 'react'

import type { PlaceResult, ResultsView, SearchState } from '../types/schedule/types'
import { MAX_RECENT_SEARCHES } from './searchPlace'

type UseSearchPlacePanelModelParams = {
  issue: 'missing_key' | 'sdk_loading' | 'search_failed' | null
  places: PlaceResult[]
  recentSearches: string[]
  requestedKeyword: string
  resultsView: ResultsView
  searchState: SearchState
  selectedPlaceId: string | null
  trimmedKeyword: string
  trimmedSelectedLocation: string
}

const getSearchMessage = ({
  placesCount,
  issue,
  requestedKeyword,
  resultsView,
  searchState,
}: {
  issue: 'missing_key' | 'sdk_loading' | 'search_failed' | null
  placesCount: number
  requestedKeyword: string
  resultsView: ResultsView
  searchState: SearchState
}) => {
  if (searchState === 'loading') {
    if (issue === 'sdk_loading') {
      return '지도를 불러오는 중입니다. 잠시 후 다시 시도해주세요.'
    }

    return `"${requestedKeyword}" 검색 중...`
  }

  if (searchState === 'success') {
    return resultsView === 'expanded'
      ? `${placesCount}개의 장소를 찾았습니다.`
      : `${placesCount}개 장소가 검색되었습니다.`
  }

  if (searchState === 'zero') return '검색 결과가 없습니다.'
  if (issue === 'missing_key') return '카카오맵 API 키가 설정되지 않았습니다.'
  if (searchState === 'error') return '장소 검색 중 오류가 발생했습니다. 다시 시도해주세요.'

  return '최근 검색어가 없습니다.'
}

const useSearchPlacePanelModel = ({
  issue,
  places,
  recentSearches,
  requestedKeyword,
  resultsView,
  searchState,
  selectedPlaceId,
  trimmedKeyword,
  trimmedSelectedLocation,
}: UseSearchPlacePanelModelParams) =>
  useMemo(() => {
    const inlinePlaces = places.slice(0, 4)
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
        ? getSearchMessage({
            issue,
            placesCount: places.length,
            requestedKeyword,
            resultsView,
            searchState,
          })
        : hasSelectedPlacePreview
          ? '현재 선택된 장소를 기준으로 지도를 보여주고 있습니다.'
          : '최근 검색어가 없습니다.'

    return {
      panelCaption,
      panelMessage,
      panelPlaces: showExpandedResults ? places : inlinePlaces,
      panelTitle,
      showExpandedResults,
      showPreviewResults,
      shouldShowRecentSearches,
    }
  }, [
    places,
    issue,
    recentSearches.length,
    requestedKeyword,
    resultsView,
    searchState,
    selectedPlaceId,
    trimmedKeyword,
    trimmedSelectedLocation,
  ])

export default useSearchPlacePanelModel
