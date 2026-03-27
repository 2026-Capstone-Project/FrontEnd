import { useEffect, useMemo, useRef, useState } from 'react'
import { type MouseEvent as ReactMouseEvent } from 'react'

import { theme } from '@/shared/styles/theme'
import type { DatePickerField } from '@/shared/types/event/event'

type UseScheduleFormAnchorsProps = {
  handleCalendarOpen: (field: DatePickerField) => void
  openSearchPlace: () => void
}

export const useScheduleFormAnchors = ({
  handleCalendarOpen,
  openSearchPlace,
}: UseScheduleFormAnchorsProps) => {
  const CALENDAR_PORTAL_WIDTH = 330
  const CALENDAR_PORTAL_HEIGHT = 360
  const VIEWPORT_MARGIN = 12
  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
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
  const handleMapButtonClick = () => {
    openSearchPlace()
  }

  // 달력 포털 위치 계산
  const portalPosition = useMemo(() => {
    if (!calendarAnchor) return null
    if (typeof window === 'undefined') return null
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const maxLeft = Math.max(
      VIEWPORT_MARGIN,
      viewportWidth - CALENDAR_PORTAL_WIDTH - VIEWPORT_MARGIN,
    )
    const nextLeft = Math.min(Math.max(calendarAnchor.left, VIEWPORT_MARGIN), maxLeft)

    const belowTop = calendarAnchor.bottom + 8
    const aboveTop = calendarAnchor.top - CALENDAR_PORTAL_HEIGHT - 8
    const fitsBelow = belowTop + CALENDAR_PORTAL_HEIGHT <= viewportHeight - VIEWPORT_MARGIN
    const clampedAboveTop = Math.max(VIEWPORT_MARGIN, aboveTop)
    const maxTop = Math.max(
      VIEWPORT_MARGIN,
      viewportHeight - CALENDAR_PORTAL_HEIGHT - VIEWPORT_MARGIN,
    )
    const nextTop = fitsBelow
      ? Math.min(Math.max(belowTop, VIEWPORT_MARGIN), maxTop)
      : Math.min(clampedAboveTop, maxTop)

    return {
      top: nextTop,
      left: nextLeft,
    }
  }, [calendarAnchor])

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
    calendarPortalStyle,
  }
}
