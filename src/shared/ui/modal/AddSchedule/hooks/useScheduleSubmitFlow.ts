import { useCallback, useState } from 'react'
import type { UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form'

import { useRepeatChangeGuard } from '@/shared/hooks/repeat/useRepeatChangeGuard'
import type { Event } from '@/shared/types/calendar/types'
import type { AddScheduleFormValues } from '@/shared/types/event/event'
import type { EditConfirmOption } from '@/shared/ui/modal'

type UseScheduleSubmitFlowProps = {
  date: string
  eventId: Event['id']
  initialEvent?: Event | null
  isEditing: boolean
  handleSubmit: UseFormHandleSubmit<AddScheduleFormValues>
  onClose: () => void
  onSubmit: (values: AddScheduleFormValues) => void
  setValue: UseFormSetValue<AddScheduleFormValues>
  patchSchedule: (
    values: AddScheduleFormValues,
    scope?: 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS' | 'ALL_EVENTS',
    occurrenceDate?: string,
  ) => void
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
  onSubmit,
  setValue,
  patchSchedule,
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
  const handleFormSubmit = handleSubmit(
    (values) => {
      if (requestConfirmation()) {
        setPendingScheduleValues(values)
        return
      }
      const isRecurringEvent =
        values.repeatConfig.repeatType !== 'none' || initialEvent?.recurrenceGroup != null
      if (isRecurringEvent) {
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
      patchSchedule(values)
      onSubmit(values)
      onClose()
    },
    (errors) => {
      console.log('[AddScheduleForm] submit errors', errors)
    },
  )

  // 반복 일정 수정 범위를 확인 후 제출 처리
  const handleConfirmedSubmit = useCallback(
    (option: EditConfirmOption) => {
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
      const scope =
        option === 'single'
          ? 'THIS_EVENT'
          : option === 'future'
            ? 'THIS_AND_FOLLOWING_EVENTS'
            : 'ALL_EVENTS'
      syncEventTiming(pendingScheduleValues)
      patchSchedule(pendingScheduleValues, scope, occurrenceDate)
      onSubmit(pendingScheduleValues)
      onClose()
      clearApplyConfirm()
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
      onSubmit,
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
