import { useEffect, useMemo, useRef, useState } from 'react'
import { type MouseEvent as ReactMouseEvent } from 'react'

import { theme } from '@/shared/styles/theme'
import type { DatePickerField } from '@/shared/types/event/event'

type UseScheduleFormAnchorsProps = {
  handleCalendarOpen: (field: DatePickerField) => void
  isSearchPlaceOpen: boolean
  openSearchPlace: () => void
}

export const useScheduleFormAnchors = ({
  handleCalendarOpen,
  isSearchPlaceOpen,
  openSearchPlace,
}: UseScheduleFormAnchorsProps) => {
  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
  const [mapAnchor, setMapAnchor] = useState<DOMRect | null>(null)
  const mapButtonRef = useRef<HTMLButtonElement | null>(null)
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`).matches
  })

  // 달력 버튼 클릭 시 앵커 위치 계산
  const handleCalendarButtonClick =
    (field: 'start' | 'end') => (event: ReactMouseEvent<HTMLButtonElement>) => {
      handleCalendarOpen(field)
      const target = event.currentTarget
      setCalendarAnchor(target.getBoundingClientRect())
    }

  // 장소 버튼 클릭 시 앵커 위치 계산
  const handleMapButtonClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    openSearchPlace()
    const target = event.currentTarget
    setMapAnchor(target.getBoundingClientRect())
  }

  // 검색 포털 열릴 때 앵커 위치 갱신
  useEffect(() => {
    if (!isSearchPlaceOpen) return undefined
    const updateAnchor = () => {
      const target = mapButtonRef.current
      if (!target) return
      setMapAnchor(target.getBoundingClientRect())
    }
    updateAnchor()
    window.addEventListener('scroll', updateAnchor, true)
    window.addEventListener('resize', updateAnchor)
    return () => {
      window.removeEventListener('scroll', updateAnchor, true)
      window.removeEventListener('resize', updateAnchor)
    }
  }, [isSearchPlaceOpen])

  // 달력 포털 위치 계산
  const portalPosition = useMemo(() => {
    if (!calendarAnchor) return null
    if (typeof window === 'undefined') return null
    const scrollY = window.scrollY || 0
    const scrollX = window.scrollX || 0
    return {
      top: calendarAnchor.bottom + scrollY + 8,
      left: calendarAnchor.left + scrollX,
    }
  }, [calendarAnchor])

  // 장소 검색 포털 위치 계산
  const searchPortalPosition = useMemo(() => {
    if (!mapAnchor) return null
    if (typeof window === 'undefined') return null
    const scrollY = window.scrollY || 0
    const scrollX = window.scrollX || 0
    return {
      top: mapAnchor.bottom + scrollY + 8,
      left: mapAnchor.left + scrollX,
    }
  }, [mapAnchor])

  // 모바일 레이아웃 감지
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`)

    const handler = (event: MediaQueryListEvent) => {
      setIsMobileLayout(event.matches)
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // 장소 검색 포털 스타일
  const searchPortalStyle = useMemo(() => {
    if (!searchPortalPosition || isMobileLayout) return undefined
    return {
      top: searchPortalPosition.top,
      left: searchPortalPosition.left,
    }
  }, [searchPortalPosition, isMobileLayout])

  // 달력 포털 스타일
  const calendarPortalStyle = useMemo(() => {
    if (!portalPosition || isMobileLayout) return undefined
    return {
      top: portalPosition.top,
      left: portalPosition.left,
    }
  }, [portalPosition, isMobileLayout])

  return {
    mapButtonRef,
    handleCalendarButtonClick,
    handleMapButtonClick,
    portalPosition,
    searchPortalPosition,
    searchPortalStyle,
    calendarPortalStyle,
  }
}
