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
  canEdit?: boolean
  onReadOnlyAttempt?: () => void
  onUserEdit?: () => void
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
  canEdit = true,
  onReadOnlyAttempt,
  onUserEdit,
}: UseScheduleFooterProps) => {
  const [deleteWarningVisible, setDeleteWarningVisible] = useState(false)
  const { useDeleteEvent } = useCalendarMutation()
  const { mutate: deleteEventMutate } = useDeleteEvent()
  const repeatConfigRef = useRef(repeatConfig)
  const eventIdRef = useRef(eventId)
  const occurrenceDateRef = useRef(occurrenceDate)
  const closeModalRef = useRef(closeModal)
  const deleteEventMutateRef = useRef(deleteEventMutate)
  const canEditRef = useRef(canEdit)
  const onReadOnlyAttemptRef = useRef(onReadOnlyAttempt)
  const onUserEditRef = useRef(onUserEdit)
  const eventColorRef = useRef(eventColor)
  const setEventColorRef = useRef(setEventColor)
  const onEventColorChangeRef = useRef(onEventColorChange)
  const isEditingRef = useRef(isEditing)
  const getValuesRef = useRef(getValues)
  const patchScheduleRef = useRef(patchSchedule)

  repeatConfigRef.current = repeatConfig
  eventIdRef.current = eventId
  occurrenceDateRef.current = occurrenceDate
  closeModalRef.current = closeModal
  deleteEventMutateRef.current = deleteEventMutate
  canEditRef.current = canEdit
  onReadOnlyAttemptRef.current = onReadOnlyAttempt
  onUserEditRef.current = onUserEdit
  eventColorRef.current = eventColor
  setEventColorRef.current = setEventColor
  onEventColorChangeRef.current = onEventColorChange
  isEditingRef.current = isEditing
  getValuesRef.current = getValues
  patchScheduleRef.current = patchSchedule

  const handleDelete = useCallback(() => {
    if (!canEditRef.current) {
      onReadOnlyAttemptRef.current?.()
      return
    }
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
  const isExistingRecurringRef = useRef(isExistingRecurring)
  isExistingRecurringRef.current = isExistingRecurring

  const handleColorChange = useCallback((value: EventColorType) => {
    if (!canEditRef.current) {
      onReadOnlyAttemptRef.current?.()
      return
    }
    const previousColor = eventColorRef.current
    const currentEventId = eventIdRef.current
    if (value !== previousColor) {
      onUserEditRef.current?.()
    }
    setEventColorRef.current(value)
    if (currentEventId != null && currentEventId !== 0) {
      onEventColorChangeRef.current?.(currentEventId, value)
    }
    if (!isEditingRef.current) {
      return
    }
    const nextValues = { ...getValuesRef.current(), eventColor: value }
    void (async () => {
      try {
        await patchScheduleRef.current(
          nextValues,
          isExistingRecurringRef.current ? RECURRENCE_EVENT_SCOPE.THIS_EVENT : undefined,
        )
      } catch (error) {
        setEventColorRef.current(previousColor)
        if (currentEventId != null && currentEventId !== 0) {
          onEventColorChangeRef.current?.(currentEventId, previousColor)
        }
        console.error('[ScheduleEditorForm] color patch failed', error)
      }
    })()
  }, [])

  const footerNode = useMemo(
    () => (canEdit ? <SelectColor value={eventColor} onChange={handleColorChange} /> : null),
    [canEdit, eventColor, handleColorChange],
  )

  // 하단 컬러 선택기를 footer에 등록
  useEffect(() => {
    registerFooterChildren?.(footerNode)
    return () => registerFooterChildren?.(null)
  }, [footerNode, registerFooterChildren])

  return { deleteWarningVisible, setDeleteWarningVisible }
}
