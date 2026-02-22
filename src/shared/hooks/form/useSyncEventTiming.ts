import { useEffect, useMemo, useRef } from 'react'

type UseSyncEventTimingArgs = {
  eventId: number | null
  fallbackDate: string
  isAllDay: boolean
  startDate?: Date | null
  endDate?: Date | null
  startTime?: string
  endTime?: string
  singlePointTime?: boolean
  buildDateTime: (dateValue: Date | null, timeValue?: string) => Date
  onEventTimingChange?: (eventId: number, start: Date, end: Date, allDay: boolean) => void
}

export const useSyncEventTiming = ({
  eventId,
  fallbackDate,
  isAllDay,
  startDate,
  endDate,
  startTime,
  endTime,
  singlePointTime = false,
  buildDateTime,
  onEventTimingChange,
}: UseSyncEventTimingArgs) => {
  const baseStartDate = useMemo(
    () => startDate ?? new Date(fallbackDate),
    [fallbackDate, startDate],
  )
  const baseEndDate = useMemo(() => endDate ?? baseStartDate, [baseStartDate, endDate])
  const lastSignatureRef = useRef<string | null>(null)

  useEffect(() => {
    if (eventId == null || eventId === 0) return
    if (!onEventTimingChange) return

    if (isAllDay) {
      const start = new Date(baseStartDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(baseEndDate)
      end.setHours(23, 59, 59, 999)
      const signature = `${eventId}:1:${start.getTime()}:${end.getTime()}`
      if (lastSignatureRef.current === signature) return
      lastSignatureRef.current = signature
      onEventTimingChange(eventId, start, end, true)
      return
    }

    const start = buildDateTime(baseStartDate, startTime)
    const end = singlePointTime ? start : buildDateTime(baseEndDate, endTime)
    const signature = `${eventId}:0:${start.getTime()}:${end.getTime()}`
    if (lastSignatureRef.current === signature) return
    lastSignatureRef.current = signature
    onEventTimingChange(eventId, start, end, false)
  }, [
    baseEndDate,
    baseStartDate,
    buildDateTime,
    endTime,
    eventId,
    isAllDay,
    onEventTimingChange,
    singlePointTime,
    startTime,
  ])
}
