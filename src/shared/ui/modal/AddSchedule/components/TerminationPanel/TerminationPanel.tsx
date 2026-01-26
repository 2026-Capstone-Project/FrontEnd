import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { theme } from '@/shared/styles/theme'
import type { RepeatConfigSchema } from '@/shared/types/event'
import type { RepeatConfig } from '@/shared/types/repeat'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import CustomDatePicker from '@/shared/ui/modal/AddSchedule/components/CustomDatePicker/CustomDatePicker'

import * as S from './TerminationPanel.style'

type Props = {
  config: RepeatConfigSchema
  updateConfig: (changes: Partial<RepeatConfig>) => void
  minDate: Date | null
}

const formatDateLabel = (value?: string) => {
  if (!value) return '날짜 선택'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '날짜 선택'
  return date.toLocaleDateString('ko-KR')
}

const TerminationPanel = ({ config, updateConfig, minDate }: Props) => {
  const terminationType = config.customEndType ?? 'until'
  const baseDate = useMemo(() => {
    const fallback = new Date()
    if (!config.customEndDate) return fallback
    const parsed = new Date(config.customEndDate)
    return Number.isNaN(parsed.getTime()) ? fallback : parsed
  }, [config.customEndDate])
  const normalizedMinDate = useMemo(() => {
    if (!minDate) return null
    const clone = new Date(minDate)
    clone.setHours(0, 0, 0, 0)
    return clone
  }, [minDate])
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const calendarRef = useRef<HTMLDivElement | null>(null)
  const portalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.getElementById('modal-root')
  }, [])

  const closeCalendar = useCallback(() => setCalendarOpen(false), [])

  useEffect(() => {
    if (!calendarOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (calendarRef.current?.contains(target)) return
      closeCalendar()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [calendarOpen, closeCalendar])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileLayout(mediaQuery.matches)
    const handler = (event: MediaQueryListEvent) => {
      setIsMobileLayout(event.matches)
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!calendarOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCalendarAnchor(null)
    }
  }, [calendarOpen])

  const handleDateSelect = (date: Date) => {
    if (normalizedMinDate && date < normalizedMinDate) return
    updateConfig({ customEndDate: date.toISOString().split('T')[0] })
    closeCalendar()
  }

  const handleCalendarTriggerClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    setCalendarAnchor(event.currentTarget.getBoundingClientRect())
    setCalendarOpen((prev) => !prev)
  }

  const calendarPortalStyle = useMemo(() => {
    if (!calendarAnchor || isMobileLayout) return undefined
    if (typeof window === 'undefined') return undefined
    const scrollY = window.scrollY || 0
    const scrollX = window.scrollX || 0
    return {
      bottom: scrollY + 290,
      left: calendarAnchor.left + scrollX,
    }
  }, [calendarAnchor, isMobileLayout])

  return (
    <S.RepeatDetail>
      <S.Label>종료</S.Label>
      <S.TerminationRow>
        <Checkbox
          checked={terminationType === 'until'}
          onChange={() => updateConfig({ customEndType: 'until' })}
        />
        <S.CalendarWrapper>
          <S.CalendarTrigger type="button" onClick={handleCalendarTriggerClick}>
            {formatDateLabel(config.customEndDate)}
          </S.CalendarTrigger>
          {calendarOpen &&
            portalRoot &&
            createPortal(
              <S.CalendarPopover ref={calendarRef} style={calendarPortalStyle}>
                <CustomDatePicker
                  field="end"
                  selectedDate={baseDate}
                  onSelectDate={handleDateSelect}
                />
              </S.CalendarPopover>,
              portalRoot,
            )}
        </S.CalendarWrapper>
        까지 반복
      </S.TerminationRow>
      <S.TerminationRow>
        <S.RadioLabel>
          <Checkbox
            checked={terminationType === 'count'}
            onChange={() => updateConfig({ customEndType: 'count' })}
          />
        </S.RadioLabel>
        <S.InlineInput
          type="number"
          min={1}
          value={config.customEndCount ?? ''}
          onChange={(event) =>
            updateConfig({ customEndCount: Number(event.target.value) || undefined })
          }
        />
        번 반복
      </S.TerminationRow>
    </S.RepeatDetail>
  )
}

export default TerminationPanel
