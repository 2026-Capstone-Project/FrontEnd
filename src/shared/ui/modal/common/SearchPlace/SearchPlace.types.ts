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
