import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'

import Check from '@/shared/assets/icons/check.svg?react'
import Search from '@/shared/assets/icons/search.svg?react'

import * as S from './SearchPlace.style'
import type { SearchPlaceProps } from './SearchPlace.types'
import { DEFAULT_CENTER } from './SearchPlace.utils'
import SearchPlacePanel from './SearchPlacePanel'
import useSearchPlace from './useSearchPlace'

const SearchPlace = ({ selectedLocation = '', onSelectLocation }: SearchPlaceProps) => {
  const kakaoAppKey = import.meta.env.VITE_KAKAO_API ?? ''
  const [isKakaoLoading, kakaoLoaderError] = useKakaoLoader({
    appkey: kakaoAppKey,
    libraries: ['services'],
  })
  const {
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
  } = useSearchPlace({
    selectedLocation,
    onSelectLocation,
    isKakaoLoading,
    kakaoAppKey,
  })

  const mapFallbackMessage = !kakaoAppKey
    ? '`.env`에 `VITE_KAKAO_API`를 설정해야 카카오맵을 사용할 수 있습니다.'
    : kakaoLoaderError
      ? '카카오맵 SDK를 불러오지 못했습니다.'
      : null
  const mapLoadingMessage = isKakaoLoading ? '지도를 불러오는 중...' : '장소 정보를 불러오는 중...'

  return (
    <S.Wrapper>
      <S.InputForm role="search" aria-label="장소 검색">
        <S.InputWrapper>
          <S.SearchInput
            type="text"
            value={keyword}
            placeholder="예: 강남역 2번 출구"
            onChange={(event) => handleKeywordChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return
              event.preventDefault()
              event.stopPropagation()
              handleSubmit()
            }}
          />
          <S.InputActions>
            <S.SearchButton
              type="button"
              disabled={isSearching || isKakaoLoading || !kakaoAppKey || !trimmedKeyword}
              onClick={handleSubmit}
              aria-label="장소 검색"
              title="장소 검색"
            >
              <Search width={18} height={18} />
            </S.SearchButton>
          </S.InputActions>
        </S.InputWrapper>
        <S.ConfirmButton
          type="button"
          disabled={!trimmedKeyword}
          $isActive={isTypedLocationSelected}
          onClick={handleUseTypedLocation}
          aria-label="입력한 장소 저장"
          title="입력한 장소 저장"
        >
          <Check width={16} height={16} />
        </S.ConfirmButton>
      </S.InputForm>
      <SearchPlacePanel
        panelTitle={panelTitle}
        panelCaption={panelCaption}
        panelMessage={panelMessage}
        panelPlaces={panelPlaces}
        recentSearches={recentSearches}
        selectedPlaceId={selectedPlaceId}
        shouldShowRecentSearches={shouldShowRecentSearches}
        showExpandedResults={showExpandedResults}
        showPreviewResults={showPreviewResults}
        onRecentSearchClick={handleRecentSearchClick}
        onRemoveRecentSearch={removeRecentSearch}
        onSelectPlace={selectPlace}
      />
      <S.MapWrapper>
        {mapFallbackMessage ? (
          <S.MapFallback>{mapFallbackMessage}</S.MapFallback>
        ) : (
          <>
            {!isKakaoLoading && (
              <Map
                center={DEFAULT_CENTER}
                style={{ width: '100%', height: '100%' }}
                level={4}
                onCreate={handleMapCreate}
              >
                {markers.map((marker) => (
                  <MapMarker
                    key={marker.id}
                    position={marker.position}
                    onClick={() => handleMarkerClick(marker.id)}
                  >
                    {selectedPlaceId === marker.id && (
                      <S.MarkerLabel>{marker.placeName}</S.MarkerLabel>
                    )}
                  </MapMarker>
                ))}
              </Map>
            )}
            {(isKakaoLoading || isSearching) && (
              <S.MapLoadingOverlay role="status" aria-live="polite">
                <S.Spinner aria-hidden="true" />
                <S.LoadingLabel>{mapLoadingMessage}</S.LoadingLabel>
              </S.MapLoadingOverlay>
            )}
          </>
        )}
      </S.MapWrapper>
    </S.Wrapper>
  )
}

export default SearchPlace
