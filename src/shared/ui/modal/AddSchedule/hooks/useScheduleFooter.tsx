import { useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { type UseFormGetValues } from 'react-hook-form'

import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { AddScheduleFormValues, EventColorType } from '@/shared/types/event/event'
import type { RepeatConfig } from '@/shared/types/event/recurrence/repeat'
import SelectColor from '@/shared/ui/modal/AddSchedule/components/SelectColor/SelectColor'

type UseScheduleFooterProps = {
  repeatConfig: RepeatConfig
  eventId: CalendarEvent['id']
  initialEvent?: CalendarEvent | null
  getValues: UseFormGetValues<AddScheduleFormValues>
  setEventColor: (value: EventColorType) => void
  patchSchedule: (
    values: AddScheduleFormValues,
    scope?: 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS' | 'ALL_EVENTS',
    occurrenceDate?: string,
  ) => void
  onEventColorChange?: (eventId: CalendarEvent['id'], color: EventColorType) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  registerDeleteHandler?: (handler?: () => void) => void
  openApplyConfirm: (values: AddScheduleFormValues) => void
  eventColor: EventColorType
  closeModal: () => void
  occurrenceDate: string
}

export const useScheduleFooter = ({
  repeatConfig,
  eventId,
  initialEvent,
  getValues,
  setEventColor,
  patchSchedule,
  onEventColorChange,
  registerFooterChildren,
  registerDeleteHandler,
  openApplyConfirm,
  eventColor,
  closeModal,
  occurrenceDate,
}: UseScheduleFooterProps) => {
  const [deleteWarningVisible, setDeleteWarningVisible] = useState(false)
  const { useDeleteEvent } = useCalendarMutation()
  const { mutate: deleteEventMutate } = useDeleteEvent()
  const queryClient = useQueryClient()
  const handleDelete = useCallback(() => {
    if (repeatConfig.repeatType !== 'none') {
      setDeleteWarningVisible(true)
    } else {
      deleteEventMutate(
        {
          eventId,
          params: {
            occurrenceDate: moment(occurrenceDate).format('YYYY-MM-DD'),
          },
        },
        {
          onSuccess: () => {
            setDeleteWarningVisible(false)
            closeModal()
            queryClient.invalidateQueries({ queryKey: ['calendar', 'events'] })
          },
        },
      )
    }
  }, [repeatConfig, closeModal, deleteEventMutate, eventId, occurrenceDate, queryClient])

  useEffect(() => {
    registerDeleteHandler?.(handleDelete)
    return () => registerDeleteHandler?.()
  }, [handleDelete, registerDeleteHandler])

  // 색상 변경 처리(반복 일정이면 확인 모달)
  const handleColorChange = useCallback(
    (value: EventColorType) => {
      setEventColor(value)
      if (eventId != null && eventId !== 0) {
        onEventColorChange?.(eventId, value)
        const nextValues = { ...getValues(), eventColor: value }
        const isExistingRecurring = initialEvent?.recurrenceGroup != null
        if (isExistingRecurring) {
          openApplyConfirm(nextValues)
        } else {
          patchSchedule(nextValues)
        }
      }
    },
    [
      eventId,
      getValues,
      initialEvent,
      onEventColorChange,
      openApplyConfirm,
      patchSchedule,
      setEventColor,
    ],
  )

  // 하단 컬러 선택기를 footer에 등록
  useEffect(() => {
    registerFooterChildren?.(<SelectColor value={eventColor} onChange={handleColorChange} />)
    return () => registerFooterChildren?.(null)
  }, [eventColor, registerFooterChildren, handleColorChange])

  return { deleteWarningVisible, setDeleteWarningVisible }
}
