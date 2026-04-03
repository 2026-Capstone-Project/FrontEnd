import { useEffect, useMemo, useState } from 'react'
import { type MouseEvent as ReactMouseEvent } from 'react'

import { theme } from '@/shared/styles/theme'
import type { DatePickerField } from '@/shared/types/event/event'

type UseScheduleCalendarOverlayProps = {
  handleCalendarOpen: (field: DatePickerField) => void
}

const CALENDAR_PORTAL_WIDTH = 330
const CALENDAR_PORTAL_HEIGHT = 360
const VIEWPORT_MARGIN = 12

export const useScheduleCalendarOverlay = ({
  handleCalendarOpen,
}: UseScheduleCalendarOverlayProps) => {
  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`).matches
  })

  const handleCalendarButtonClick =
    (field: DatePickerField) => (event: ReactMouseEvent<HTMLButtonElement>) => {
      handleCalendarOpen(field)
      setCalendarAnchor(event.currentTarget.getBoundingClientRect())
    }

  const portalPosition = useMemo(() => {
    if (!calendarAnchor || typeof window === 'undefined') return null

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

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const mediaQuery = window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`)
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobileLayout(event.matches)
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange)
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange)
  }, [])

  const calendarPortalStyle = useMemo(() => {
    if (!portalPosition || isMobileLayout) return undefined
    return {
      top: portalPosition.top,
      left: portalPosition.left,
    }
  }, [isMobileLayout, portalPosition])

  return {
    calendarPortalStyle,
    handleCalendarButtonClick,
    hasCalendarPortal: Boolean(portalPosition),
  }
}
