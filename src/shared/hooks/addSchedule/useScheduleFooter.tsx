import moment from 'moment'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { type UseFormGetValues } from 'react-hook-form'

import { RECURRENCE_EVENT_SCOPE } from '@/shared/constants/recurrenceScope'
import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { EventColorType, ScheduleEditorFormValues } from '@/shared/types/event/event'
import type { RecurrenceEventScope } from '@/shared/types/recurrence/recurrence'
import type { RepeatConfig } from '@/shared/types/recurrence/repeat'
import SelectColor from '@/shared/ui/scheduleTodo/SelectColor/SelectColor'

type UseScheduleFooterProps = {
  repeatConfig: RepeatConfig
  eventId: CalendarEvent['id']
  initialEvent?: CalendarEvent | null
  isEditing: boolean
  getValues: UseFormGetValues<ScheduleEditorFormValues>
  setEventColor: (value: EventColorType) => void
  patchSchedule: (
    values: ScheduleEditorFormValues,
    scope?: RecurrenceEventScope,
    occurrenceDate?: string,
  ) => Promise<unknown>
  onEventColorChange?: (eventId: CalendarEvent['id'], color: EventColorType) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  registerDeleteHandler?: (handler?: () => void) => void
  eventColor: EventColorType
  closeModal: () => void
  occurrenceDate: string
}

export const useScheduleFooter = ({
  repeatConfig,
  eventId,
  initialEvent,
  isEditing,
  getValues,
  setEventColor,
  patchSchedule,
  onEventColorChange,
  registerFooterChildren,
  registerDeleteHandler,
  eventColor,
  closeModal,
  occurrenceDate,
}: UseScheduleFooterProps) => {
  const [deleteWarningVisible, setDeleteWarningVisible] = useState(false)
  const { useDeleteEvent } = useCalendarMutation()
  const { mutate: deleteEventMutate } = useDeleteEvent()
  const repeatConfigRef = useRef(repeatConfig)
  const eventIdRef = useRef(eventId)
  const occurrenceDateRef = useRef(occurrenceDate)
  const closeModalRef = useRef(closeModal)
  const deleteEventMutateRef = useRef(deleteEventMutate)

  useEffect(() => {
    repeatConfigRef.current = repeatConfig
  }, [repeatConfig])
  useEffect(() => {
    eventIdRef.current = eventId
  }, [eventId])
  useEffect(() => {
    occurrenceDateRef.current = occurrenceDate
  }, [occurrenceDate])
  useEffect(() => {
    closeModalRef.current = closeModal
  }, [closeModal])
  useEffect(() => {
    deleteEventMutateRef.current = deleteEventMutate
  }, [deleteEventMutate])

  const handleDelete = useCallback(() => {
    if (repeatConfigRef.current.repeatType !== 'none') {
      setDeleteWarningVisible(true)
      return
    }
    deleteEventMutateRef.current(
      {
        eventId: eventIdRef.current,
        params: {
          occurrenceDate: moment(occurrenceDateRef.current).format('YYYY-MM-DDTHH:mm:ss'),
        },
      },
      {
        onSuccess: () => {
          setDeleteWarningVisible(false)
          closeModalRef.current()
        },
      },
    )
  }, [])

  useEffect(() => {
    registerDeleteHandler?.(handleDelete)
    return () => registerDeleteHandler?.()
  }, [handleDelete, registerDeleteHandler])

  // 색상 변경 처리(편집 모드에서는 즉시 patch)
  const isExistingRecurring = useMemo(
    () => initialEvent?.recurrenceGroup != null,
    [initialEvent?.recurrenceGroup],
  )

  const handleColorChange = useCallback(
    (value: EventColorType) => {
      const previousColor = eventColor
      setEventColor(value)
      if (eventId != null && eventId !== 0) {
        onEventColorChange?.(eventId, value)
      }
      if (!isEditing) {
        return
      }
      const nextValues = { ...getValues(), eventColor: value }
      void (async () => {
        try {
          await patchSchedule(
            nextValues,
            isExistingRecurring ? RECURRENCE_EVENT_SCOPE.THIS_EVENT : undefined,
          )
        } catch (error) {
          setEventColor(previousColor)
          if (eventId != null && eventId !== 0) {
            onEventColorChange?.(eventId, previousColor)
          }
          console.error('[ScheduleEditorForm] color patch failed', error)
        }
      })()
    },
    [
      eventColor,
      eventId,
      getValues,
      isEditing,
      isExistingRecurring,
      onEventColorChange,
      patchSchedule,
      setEventColor,
    ],
  )

  const footerNode = useMemo(
    () => <SelectColor value={eventColor} onChange={handleColorChange} />,
    [eventColor, handleColorChange],
  )

  // 하단 컬러 선택기를 footer에 등록
  useEffect(() => {
    registerFooterChildren?.(footerNode)
    return () => registerFooterChildren?.(null)
  }, [footerNode, registerFooterChildren])

  return { deleteWarningVisible, setDeleteWarningVisible }
}
