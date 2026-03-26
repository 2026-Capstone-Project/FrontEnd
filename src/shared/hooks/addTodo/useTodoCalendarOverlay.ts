import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type MouseEvent as ReactMouseEvent } from 'react'
import type { UseFormSetValue } from 'react-hook-form'

import { theme } from '@/shared/styles/theme'
import type {
  DatePickerField,
  TimePickerField,
  TodoEditorFormValues,
} from '@/shared/types/event/event'

type UseTodoCalendarOverlayProps = {
  setValue: UseFormSetValue<TodoEditorFormValues>
}

export const useTodoCalendarOverlay = ({ setValue }: UseTodoCalendarOverlayProps) => {
  const [activeCalendarField, setActiveCalendarField] = useState<DatePickerField | null>(null)
  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`).matches
  })
  const calendarRef = useRef<HTMLDivElement | null>(null)

  const handleCalendarClose = useCallback(() => {
    setActiveCalendarField(null)
  }, [])

  const handleCalendarButtonClick =
    (field: DatePickerField) => (event: ReactMouseEvent<HTMLButtonElement>) => {
      setActiveCalendarField(field)
      setCalendarAnchor(event.currentTarget.getBoundingClientRect())
    }

  const handleDateSelect = useCallback(
    (selectedDate: Date) => {
      if (!activeCalendarField) return
      setValue('todoDate', selectedDate, { shouldValidate: true })
      handleCalendarClose()
    },
    [activeCalendarField, handleCalendarClose, setValue],
  )

  const handleTimeChange = useCallback(
    (_field: TimePickerField, value: string) => {
      setValue('todoEndTime', value, { shouldValidate: true })
    },
    [setValue],
  )

  useEffect(() => {
    if (!activeCalendarField) return undefined

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (calendarRef.current?.contains(target)) return
      handleCalendarClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [activeCalendarField, handleCalendarClose])

  const portalPosition = useMemo(() => {
    if (!calendarAnchor || typeof window === 'undefined') return null
    const scrollY = window.scrollY || 0
    const scrollX = window.scrollX || 0
    return {
      top: calendarAnchor.bottom + scrollY + 8,
      left: calendarAnchor.left + scrollX,
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
    activeCalendarField,
    calendarPortalStyle,
    calendarRef,
    handleCalendarButtonClick,
    handleDateSelect,
    handleTimeChange,
    hasCalendarPortal: Boolean(portalPosition),
  }
}
