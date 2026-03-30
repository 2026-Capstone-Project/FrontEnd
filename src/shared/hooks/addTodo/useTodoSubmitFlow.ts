import { useCallback, useState } from 'react'
import type { UseFormHandleSubmit, UseFormSetValue } from 'react-hook-form'

import { useRepeatChangeGuard } from '@/shared/hooks/repeat/useRepeatChangeGuard'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { TodoEditorFormValues } from '@/shared/types/event/event'
import type { RecurrenceTodoScope } from '@/shared/types/recurrence/recurrence'
import type { EditConfirmOption } from '@/shared/ui/Modals'
import { getFormErrorMessage } from '@/shared/utils'
import { useToastStore } from '@/store/useToastStore'

type UseTodoSubmitFlowProps = {
  eventId: CalendarEvent['id']
  hasExistingRecurrence: boolean
  repeatGuardEnabled: boolean
  isDetailReady: boolean
  repeatConfig: TodoEditorFormValues['repeatConfig']
  setValue: UseFormSetValue<TodoEditorFormValues>
  handleSubmit: UseFormHandleSubmit<TodoEditorFormValues>
  patchOccurrenceDate: string
  onSubmit: (
    values: TodoEditorFormValues,
    options?: { occurrenceDate?: string; scope?: RecurrenceTodoScope },
  ) => Promise<unknown>
  onClose: () => void
  syncEventTiming: (values: TodoEditorFormValues) => void
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: string) => void
}

export const useTodoSubmitFlow = ({
  eventId,
  hasExistingRecurrence,
  repeatGuardEnabled,
  isDetailReady,
  repeatConfig,
  setValue,
  handleSubmit,
  patchOccurrenceDate,
  onSubmit,
  onClose,
  syncEventTiming,
  onEventTitleConfirm,
}: UseTodoSubmitFlowProps) => {
  const {
    isOpen: isEditConfirmOpen,
    confirmChange,
    revertChange,
    requestConfirmation,
  } = useRepeatChangeGuard({
    repeatConfig,
    isEditing: repeatGuardEnabled,
    setValue,
  })
  const [isApplyConfirmOpen, setIsApplyConfirmOpen] = useState(false)
  const [pendingTodoValues, setPendingTodoValues] = useState<TodoEditorFormValues | null>(null)

  const confirmTitle = useCallback(
    (values: TodoEditorFormValues) => {
      if (eventId == null || eventId === 0) return
      const nextTitle = values.todoTitle ?? ''
      if (nextTitle) {
        onEventTitleConfirm?.(eventId, nextTitle)
      }
    },
    [eventId, onEventTitleConfirm],
  )

  const clearApplyConfirm = useCallback(() => {
    setPendingTodoValues(null)
    setIsApplyConfirmOpen(false)
  }, [])

  const showToast = useToastStore.getState().showToast

  // 제출 경로를 하나로 모아 반복/단건 모두 동일한 에러 처리 정책을 사용합니다.
  const submitTodoValues = useCallback(
    async (
      values: TodoEditorFormValues,
      options?: { scope?: RecurrenceTodoScope; shouldConfirmChange?: boolean },
    ) => {
      if (options?.shouldConfirmChange) {
        confirmChange()
      }
      confirmTitle(values)
      syncEventTiming(values)

      const submitOptions = {
        occurrenceDate: patchOccurrenceDate,
        ...(options?.scope ? { scope: options.scope } : {}),
      }

      try {
        await onSubmit(values, submitOptions)
        onClose()
        clearApplyConfirm()
      } catch (error) {
        console.error('[TodoEditorForm] submit failed', error)
      }
    },
    [
      clearApplyConfirm,
      confirmChange,
      confirmTitle,
      onClose,
      onSubmit,
      patchOccurrenceDate,
      syncEventTiming,
    ],
  )

  const handleFormSubmit = handleSubmit(
    async (values) => {
      // 편집 모달에서 상세 데이터가 아직 hydrate 되지 않았다면
      // recurrence/occurrenceDate 판단이 틀어질 수 있어 제출을 잠시 막습니다.
      if (!isDetailReady) {
        showToast({
          title: '할 일 정보를 불러오는 중입니다',
          message: '잠시 후 다시 시도해주세요.',
          toastType: 'warning',
        })
        return
      }
      if (requestConfirmation()) {
        setPendingTodoValues(values)
        return
      }
      if (hasExistingRecurrence) {
        setPendingTodoValues(values)
        setIsApplyConfirmOpen(true)
        return
      }
      await submitTodoValues(values)
    },
    (errors) => {
      showToast({
        title: '할 일 입력을 확인해주세요',
        message: getFormErrorMessage(errors, '필수 입력 항목을 다시 확인해주세요.'),
        toastType: 'warning',
      })
    },
  )

  const handleConfirmedSubmit = useCallback(
    async (option: EditConfirmOption) => {
      if (!pendingTodoValues) return
      const scope: RecurrenceTodoScope = option === 'future' ? 'THIS_AND_FOLLOWING' : 'THIS_TODO'
      await submitTodoValues(pendingTodoValues, {
        scope,
        shouldConfirmChange: isEditConfirmOpen,
      })
    },
    [isEditConfirmOpen, pendingTodoValues, submitTodoValues],
  )

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
  }
}
