import { useCallback, useEffect, useRef, useState } from 'react'

export const useSearchPlaceToggle = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const [isSearchPlaceOpen, setIsSearchPlaceOpen] = useState(false)
  const openSearchPlace = useCallback(() => setIsSearchPlaceOpen(true), [])
  const closeSearchPlace = useCallback(() => setIsSearchPlaceOpen(false), [])

  useEffect(() => {
    if (!isSearchPlaceOpen) return undefined
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (mapRef.current?.contains(target)) return
      closeSearchPlace()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [closeSearchPlace, isSearchPlaceOpen])

  return {
    mapRef,
    isSearchPlaceOpen,
    openSearchPlace,
    closeSearchPlace,
  }
}
