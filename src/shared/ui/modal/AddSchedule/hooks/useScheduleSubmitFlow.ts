import { useCallback, useState } from 'react'
import type { UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form'

import { useRepeatChangeGuard } from '@/shared/hooks/repeat/useRepeatChangeGuard'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { AddScheduleFormValues } from '@/shared/types/event/event'
import type { RecurrenceEventScope } from '@/shared/types/recurrence/recurrence'
import type { EditConfirmOption } from '@/shared/ui/modal'

type UseScheduleSubmitFlowProps = {
  date: string
  eventId: CalendarEvent['id']
  initialEvent?: CalendarEvent | null
  isEditing: boolean
  handleSubmit: UseFormHandleSubmit<AddScheduleFormValues>
  onClose: () => void
  setValue: UseFormSetValue<AddScheduleFormValues>
  patchSchedule: (
    values: AddScheduleFormValues,
    scope?: RecurrenceEventScope,
    occurrenceDate?: string,
  ) => Promise<unknown>
  createSchedule: (values: AddScheduleFormValues) => Promise<unknown>
  syncEventTiming: (values: AddScheduleFormValues) => void
  handleTitleConfirm: (value: string) => void
  buildDateTime: (dateValue: Date | null, timeValue?: string) => Date
  formatDateTime: (value: Date) => string
  repeatConfig: AddScheduleFormValues['repeatConfig']
}

export const useScheduleSubmitFlow = ({
  date,
  eventId,
  initialEvent,
  isEditing,
  handleSubmit,
  onClose,
  setValue,
  patchSchedule,
  createSchedule,
  syncEventTiming,
  handleTitleConfirm,
  buildDateTime,
  formatDateTime,
  repeatConfig,
}: UseScheduleSubmitFlowProps) => {
  // 반복 변경 시 편집 확인 모달을 띄우는 guard 훅
  const {
    isOpen: isEditConfirmOpen,
    confirmChange,
    revertChange,
    requestConfirmation,
  } = useRepeatChangeGuard({
    repeatConfig,
    isEditing,
    setValue,
  })

  const [pendingScheduleValues, setPendingScheduleValues] = useState<AddScheduleFormValues | null>(
    null,
  )
  const [isApplyConfirmOpen, setIsApplyConfirmOpen] = useState(false)
  const isExistingRecurring = initialEvent?.recurrenceGroup != null

  // 반복 일정 적용 범위 모달 열기
  const openApplyConfirm = useCallback((values: AddScheduleFormValues) => {
    setPendingScheduleValues(values)
    setIsApplyConfirmOpen(true)
  }, [])

  // 반복 일정 적용 범위 모달 닫기
  const clearApplyConfirm = useCallback(() => {
    setPendingScheduleValues(null)
    setIsApplyConfirmOpen(false)
  }, [])

  // 폼 제출 처리(일반/반복 분기)
  const handleFormSubmit = handleSubmit(async (values) => {
    if (isExistingRecurring && requestConfirmation()) {
      setPendingScheduleValues(values)
      return
    }
    if (isExistingRecurring) {
      openApplyConfirm(values)
      return
    }
    if (eventId != null && eventId !== 0) {
      const nextTitle = values.eventTitle ?? ''
      if (nextTitle) {
        handleTitleConfirm(nextTitle)
      }
    }
    syncEventTiming(values)
    try {
      if (isEditing) {
        await patchSchedule(values)
      } else {
        await createSchedule(values)
      }
      onClose()
    } catch {
      return
    }
  })

  // 반복 일정 수정 범위를 확인 후 제출 처리
  const handleConfirmedSubmit = useCallback(
    async (option: EditConfirmOption) => {
      void option
      if (!pendingScheduleValues) return
      if (isEditConfirmOpen) {
        confirmChange()
      }
      if (eventId != null && eventId !== 0) {
        const nextTitle = pendingScheduleValues.eventTitle ?? ''
        if (nextTitle) {
          handleTitleConfirm(nextTitle)
        }
      }
      const startDate = pendingScheduleValues.eventStartDate ?? new Date(date)
      const occurrenceDate = formatDateTime(
        buildDateTime(startDate, pendingScheduleValues.eventStartTime),
      )
      const scope = option === 'future' ? 'THIS_AND_FOLLOWING_EVENTS' : 'THIS_EVENT'
      syncEventTiming(pendingScheduleValues)
      try {
        await patchSchedule(pendingScheduleValues, scope, occurrenceDate)
        onClose()
        clearApplyConfirm()
      } catch {
        return
      }
    },
    [
      buildDateTime,
      clearApplyConfirm,
      confirmChange,
      date,
      eventId,
      formatDateTime,
      handleTitleConfirm,
      isEditConfirmOpen,
      onClose,
      patchSchedule,
      pendingScheduleValues,
      syncEventTiming,
    ],
  )

  // 반복 변경/적용 모달 취소 처리
  const handleCancelRepeat = useCallback(() => {
    if (isEditConfirmOpen) {
      revertChange()
    }
    clearApplyConfirm()
  }, [clearApplyConfirm, isEditConfirmOpen, revertChange])

  return {
    isEditConfirmOpen,
    isApplyConfirmOpen,
    handleFormSubmit,
    handleConfirmedSubmit,
    handleCancelRepeat,
    openApplyConfirm,
    clearApplyConfirm,
    setPendingScheduleValues,
  }
}
