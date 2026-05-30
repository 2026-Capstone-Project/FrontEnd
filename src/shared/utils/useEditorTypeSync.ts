import { type RefObject, useEffect, useRef, useState } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { ItemEditorDraft, ItemType } from '@/shared/types/modal/itemEditor'

const buildDateTime = (fallbackDate: string, dateValue?: Date | null, timeValue?: string) => {
  const nextDate = dateValue ? new Date(dateValue) : new Date(fallbackDate)
  if (!timeValue) {
    nextDate.setHours(0, 0, 0, 0)
    return nextDate
  }
  const [hour, minute] = timeValue.split(':').map((value) => Number.parseInt(value, 10))
  nextDate.setHours(Number.isNaN(hour) ? 0 : hour, Number.isNaN(minute) ? 0 : minute, 0, 0)
  return nextDate
}

type UseEditorTypeSyncParams = {
  initialType: ItemType
  showTypeTabs: boolean
  eventId: CalendarEvent['id']
  date: string
  initialEvent: CalendarEvent | null
  draftValuesRef: RefObject<ItemEditorDraft | null>
  onEventTypeChange?: (eventId: CalendarEvent['id'], type: ItemType) => void
  onEventTimingChange?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
    occurrenceDate?: CalendarEvent['occurrenceDate'],
  ) => void
}

export const useEditorTypeSync = ({
  initialType,
  showTypeTabs,
  eventId,
  date,
  initialEvent,
  draftValuesRef,
  onEventTypeChange,
  onEventTimingChange,
}: UseEditorTypeSyncParams) => {
  const [activeType, setActiveType] = useState<ItemType>(initialType)
  const [isScheduleShared, setIsScheduleShared] = useState(
    initialType === 'schedule' && Boolean(initialEvent?.isShared),
  )
  const previousActiveTypeRef = useRef(activeType)

  useEffect(() => {
    setActiveType(initialType)
  }, [initialType])

  useEffect(() => {
    setIsScheduleShared(initialType === 'schedule' && Boolean(initialEvent?.isShared))
  }, [initialEvent?.isShared, initialType])

  useEffect(() => {
    if (activeType !== 'schedule') {
      setIsScheduleShared(false)
    }
  }, [activeType])

  useEffect(() => {
    if (eventId == null || eventId === 0) return
    onEventTypeChange?.(eventId, activeType)
  }, [activeType, eventId, onEventTypeChange])

  useEffect(() => {
    if (!showTypeTabs) return
    if (previousActiveTypeRef.current === activeType) return
    previousActiveTypeRef.current = activeType
    if (eventId == null || eventId === 0) return
    if (!onEventTimingChange) return

    const latestDraftValues = draftValuesRef.current
    const startDate =
      latestDraftValues?.startDate ?? (initialEvent?.start ? new Date(initialEvent.start) : null)
    const endDate =
      latestDraftValues?.endDate ?? (initialEvent?.end ? new Date(initialEvent.end) : startDate)
    const isAllDay = latestDraftValues?.isAllday ?? initialEvent?.isAllDay ?? false
    const occurrenceDate = initialEvent?.occurrenceDate

    if (activeType === 'todo') {
      if (isAllDay) {
        const start = new Date(startDate ?? new Date(date))
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setHours(23, 59, 59, 999)
        onEventTimingChange(eventId, start, end, true, occurrenceDate)
        return
      }
      const point = buildDateTime(
        date,
        startDate,
        latestDraftValues?.endTime ?? latestDraftValues?.startTime,
      )
      onEventTimingChange(eventId, point, point, false, occurrenceDate)
      return
    }

    if (isAllDay) {
      const start = new Date(startDate ?? new Date(date))
      start.setHours(0, 0, 0, 0)
      const end = new Date(endDate ?? start)
      end.setHours(23, 59, 59, 999)
      onEventTimingChange(eventId, start, end, true, occurrenceDate)
      return
    }

    const start = buildDateTime(date, startDate, latestDraftValues?.startTime)
    const end = buildDateTime(date, endDate ?? startDate, latestDraftValues?.endTime)
    onEventTimingChange(eventId, start, end, false, occurrenceDate)
  }, [
    activeType,
    date,
    draftValuesRef,
    eventId,
    initialEvent?.end,
    initialEvent?.isAllDay,
    initialEvent?.occurrenceDate,
    initialEvent?.start,
    onEventTimingChange,
    showTypeTabs,
  ])

  return { activeType, setActiveType, isScheduleShared, setIsScheduleShared }
}
