import type { SearchPlacePanelProps } from '@/shared/types/schedule/types'
import RecentSearch from '@/shared/ui/scheduleTodo/RecentSearch/RecentSearch'
import { getPlaceAddressValue } from '@/shared/utils/searchPlace'

import * as S from './SearchPlace.style'

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
