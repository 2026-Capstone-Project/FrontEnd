import type { PlaceMarker, PlaceResult } from './SearchPlace.types'

export const DEFAULT_CENTER = {
  lat: 37.566826,
  lng: 126.9786567,
}

export const MAX_RECENT_SEARCHES = 5
export const AUTO_SEARCH_DELAY_MS = 2000

const RECENT_SEARCHES_STORAGE_KEY = 'calio:recent-place-searches'

export const readRecentSearches = () => {
  if (typeof window === 'undefined') return []

  try {
    const rawValue = window.localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY)
    if (!rawValue) return []

    const parsedValue = JSON.parse(rawValue)
    if (!Array.isArray(parsedValue)) return []

    return parsedValue
      .filter((value): value is string => typeof value === 'string')
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, MAX_RECENT_SEARCHES)
  } catch {
    return []
  }
}

export const writeRecentSearches = (values: string[]) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(values))
  } catch {
    // localStorage may be unavailable in private mode or restricted environments
  }
}

export const toMarker = (place: PlaceResult): PlaceMarker => ({
  id: place.id,
  placeName: place.place_name,
  position: {
    lat: Number(place.y),
    lng: Number(place.x),
  },
})

export const getPlaceLocationValue = (place: PlaceResult) => place.place_name

export const getPlaceAddressValue = (place: PlaceResult) =>
  place.road_address_name || place.address_name || null
