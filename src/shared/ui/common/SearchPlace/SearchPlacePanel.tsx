import RecentSearch from '@/shared/ui/common/RecentSearch/RecentSearch'

import * as S from './SearchPlace.style'
import type { PlaceResult } from './SearchPlace.types'
import { getPlaceAddressValue } from './SearchPlace.utils'

type SearchPlacePanelProps = {
  panelTitle: string
  panelCaption: string | null
  panelMessage: string
  panelPlaces: PlaceResult[]
  recentSearches: string[]
  selectedPlaceId: string | null
  shouldShowRecentSearches: boolean
  showExpandedResults: boolean
  showPreviewResults: boolean
  onRecentSearchClick: (value: string) => void
  onRemoveRecentSearch: (value: string) => void
  onSelectPlace: (place: PlaceResult) => void
}

const SearchPlacePanel = ({
  panelTitle,
  panelCaption,
  panelMessage,
  panelPlaces,
  recentSearches,
  selectedPlaceId,
  shouldShowRecentSearches,
  showExpandedResults,
  showPreviewResults,
  onRecentSearchClick,
  onRemoveRecentSearch,
  onSelectPlace,
}: SearchPlacePanelProps) => (
  <S.SearchPanel>
    <S.PanelHeader>
      <S.PanelTitle>{panelTitle}</S.PanelTitle>
      {panelCaption && <S.PanelCaption>{panelCaption}</S.PanelCaption>}
    </S.PanelHeader>
    <S.PanelBody>
      {(showPreviewResults || showExpandedResults) && (
        <S.PanelScroll>
          <S.SearchList>
            {panelPlaces.map((place) => {
              const isActive = place.id === selectedPlaceId
              const address = getPlaceAddressValue(place) ?? ''

              return (
                <S.ResultButton
                  key={place.id}
                  type="button"
                  $isActive={isActive}
                  $compact={!showExpandedResults}
                  onClick={() => onSelectPlace(place)}
                >
                  <S.PlaceName>{place.place_name}</S.PlaceName>
                  <S.PlaceMeta>{place.category_name}</S.PlaceMeta>
                  <S.PlaceAddress>{address}</S.PlaceAddress>
                </S.ResultButton>
              )
            })}
          </S.SearchList>
        </S.PanelScroll>
      )}
      {!showPreviewResults && !showExpandedResults && shouldShowRecentSearches && (
        <S.PanelScroll>
          <S.RecentList>
            {recentSearches.map((recentKeyword) => (
              <RecentSearch
                key={recentKeyword}
                name={recentKeyword}
                onClick={() => onRecentSearchClick(recentKeyword)}
                onDelete={() => onRemoveRecentSearch(recentKeyword)}
              />
            ))}
          </S.RecentList>
        </S.PanelScroll>
      )}
      {!showPreviewResults && !showExpandedResults && !shouldShowRecentSearches && (
        <S.EmptyState>{panelMessage}</S.EmptyState>
      )}
    </S.PanelBody>
  </S.SearchPanel>
)

export default SearchPlacePanel
