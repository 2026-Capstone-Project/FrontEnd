import { useCallback, useState } from 'react'
import type { UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form'

import { useRepeatChangeGuard } from '@/shared/hooks/repeat/useRepeatChangeGuard'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { ScheduleEditorFormValues } from '@/shared/types/event/event'
import type { RecurrenceEventScope } from '@/shared/types/recurrence/recurrence'
import type { EditConfirmOption } from '@/shared/ui/Modals'

type UseScheduleSubmitFlowProps = {
  date: string
  eventId: CalendarEvent['id']
  initialEvent?: CalendarEvent | null
  isEditing: boolean
  handleSubmit: UseFormHandleSubmit<ScheduleEditorFormValues>
  onClose: () => void
  setValue: UseFormSetValue<ScheduleEditorFormValues>
  patchSchedule: (
    values: ScheduleEditorFormValues,
    scope?: RecurrenceEventScope,
    occurrenceDate?: string,
  ) => Promise<unknown>
  createSchedule: (values: ScheduleEditorFormValues) => Promise<unknown>
  syncEventTiming: (values: ScheduleEditorFormValues) => void
  handleTitleConfirm: (value: string) => void
  buildDateTime: (dateValue: Date | null, timeValue?: string) => Date
  formatDateTime: (value: Date) => string
  repeatConfig: ScheduleEditorFormValues['repeatConfig']
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

  const [pendingScheduleValues, setPendingScheduleValues] =
    useState<ScheduleEditorFormValues | null>(null)
  const [isApplyConfirmOpen, setIsApplyConfirmOpen] = useState(false)
  const isExistingRecurring = initialEvent?.recurrenceGroup != null

  // 반복 일정 적용 범위 모달 열기
  const openApplyConfirm = useCallback((values: ScheduleEditorFormValues) => {
    setPendingScheduleValues(values)
    setIsApplyConfirmOpen(true)
  }, [])

  // 반복 일정 적용 범위 모달 닫기
  const clearApplyConfirm = useCallback(() => {
    setPendingScheduleValues(null)
    setIsApplyConfirmOpen(false)
  }, [])

  const confirmTitle = useCallback(
    (values: ScheduleEditorFormValues) => {
      if (eventId == null || eventId === 0) return
      const nextTitle = values.eventTitle ?? ''
      if (nextTitle) {
        handleTitleConfirm(nextTitle)
      }
    },
    [eventId, handleTitleConfirm],
  )

  // 일반 생성/일반 수정/반복 수정(범위 선택) 모두 이 경로를 통해 제출합니다.
  // 분기마다 흩어진 try/catch를 모아 에러 처리 정책을 일관되게 유지합니다.
  const submitScheduleValues = useCallback(
    async (
      values: ScheduleEditorFormValues,
      options: {
        mode: 'create' | 'patch'
        scope?: RecurrenceEventScope
        occurrenceDate?: string
        shouldConfirmChange?: boolean
      },
    ) => {
      if (options.shouldConfirmChange) {
        confirmChange()
      }
      confirmTitle(values)
      syncEventTiming(values)

      try {
        if (options.mode === 'patch') {
          await patchSchedule(values, options.scope, options.occurrenceDate)
        } else {
          await createSchedule(values)
        }
        onClose()
        clearApplyConfirm()
      } catch (error) {
        console.error('[ScheduleEditorForm] submit failed', error)
      }
    },
    [
      clearApplyConfirm,
      confirmChange,
      confirmTitle,
      createSchedule,
      onClose,
      patchSchedule,
      syncEventTiming,
    ],
  )

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
    await submitScheduleValues(values, {
      mode: isEditing ? 'patch' : 'create',
    })
  })

  // 반복 일정 수정 범위를 확인 후 제출 처리
  const handleConfirmedSubmit = useCallback(
    async (option: EditConfirmOption) => {
      if (!pendingScheduleValues) return
      const fallbackStartDate = pendingScheduleValues.eventStartDate ?? new Date(date)
      const fallbackOccurrenceDate = formatDateTime(
        buildDateTime(fallbackStartDate, pendingScheduleValues.eventStartTime),
      )
      // occurrenceDate를 현재 수정 중인 인스턴스로 고정해,
      // 반복 일정에서도 사용자가 연 occurrence를 기준으로 patch 요청을 보냅니다.
      const occurrenceDate = initialEvent?.occurrenceDate
        ? formatDateTime(new Date(initialEvent.occurrenceDate))
        : fallbackOccurrenceDate
      const scope = option === 'future' ? 'THIS_AND_FOLLOWING_EVENTS' : 'THIS_EVENT'
      await submitScheduleValues(pendingScheduleValues, {
        mode: 'patch',
        scope,
        occurrenceDate,
        shouldConfirmChange: isEditConfirmOpen,
      })
    },
    [
      buildDateTime,
      date,
      formatDateTime,
      initialEvent,
      isEditConfirmOpen,
      pendingScheduleValues,
      submitScheduleValues,
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
