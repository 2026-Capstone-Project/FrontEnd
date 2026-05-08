export type PlaceResult = kakao.maps.services.PlacesSearchResultItem

export type PlaceMarker = {
  id: string
  placeName: string
  position: {
    lat: number
    lng: number
  }
}

export type SearchPlaceSelectionOptions = {
  closeAfterSelect?: boolean
  address?: string | null
}

export type SearchPlaceProps = {
  selectedLocation?: string
  onSelectLocation: (location: string, options?: SearchPlaceSelectionOptions) => void
}

export type SearchState = 'idle' | 'loading' | 'success' | 'zero' | 'error'
export type ResultsView = 'hidden' | 'inline' | 'expanded'

export type SearchPlacePanelProps = {
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

export type UseSearchPlaceParams = Pick<
  SearchPlaceProps,
  'onSelectLocation' | 'selectedLocation'
> & {
  isKakaoLoading: boolean
  kakaoAppKey: string
}
