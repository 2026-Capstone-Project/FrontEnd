// 할 일 편집 본문을 조합하고 상세 조회, 제출, 삭제, 닫기 보호 흐름을 연결합니다.
import { useCallback, useEffect, useRef } from 'react'

import { useTodoDetailHydration, useTodoFooter, useTodoSubmitFlow } from '@/shared/hooks/addTodo'
import { useUnsavedCloseGuard } from '@/shared/hooks/common/useUnsavedCloseGuard'
import { useSyncEventTiming } from '@/shared/hooks/form'
import type { UseTodoEditorFormResult } from '@/shared/hooks/form/useTodoEditorForm'
import type { TodoEditorFormValues } from '@/shared/types/event/event'
import type { TodoEditorFormProps } from '@/shared/types/modal/todoEditor'
import { UnsavedChangesConfirmModal } from '@/shared/ui/Modals'
import TodoEditorConfirmModals from '@/shared/ui/Modals/TodoEditor/TodoEditorConfirmModals'
import TodoEditorFields from '@/shared/ui/Modals/TodoEditor/TodoEditorFields'

type TodoEditorContentProps = TodoEditorFormProps & {
  todo: UseTodoEditorFormResult
}

const TodoEditorContent = ({
  date,
  mode = 'modal',
  eventId,
  onClose,
  registerDeleteHandler,
  registerCloseGuard,
  registerFooterChildren,
  isEditing = false,
  initialEvent,
  headerTitlePortalTarget,
  onEventTitleConfirm,
  onEventColorChange,
  onEventTimingChange,
  todo,
}: TodoEditorContentProps) => {
  const { setValue, formState } = todo.formMethods
  const { isDirty } = formState
  const { detailData, hasExistingRecurrence, isDetailReady, isPersistedTodo, occurrenceDate } =
    useTodoDetailHydration({
      date,
      eventId,
      isEditing,
      todoDate: todo.todoDate,
      setValue,
    })
  const originalTitleRef = useRef('')

  useEffect(() => {
    if (!isEditing) {
      originalTitleRef.current = ''
      return
    }
    originalTitleRef.current = initialEvent?.title ?? ''
  }, [eventId, initialEvent?.occurrenceDate, initialEvent?.start, initialEvent?.title, isEditing])

  useEffect(() => {
    if (!isEditing) return
    if (detailData?.result?.title == null) return
    originalTitleRef.current = detailData.result.title
  }, [detailData?.result?.title, isEditing])

  const handleDiscardDraftTitle = useCallback(() => {
    if (!isEditing || eventId == null || eventId === 0) return
    onEventTitleConfirm?.(eventId, originalTitleRef.current)
  }, [eventId, isEditing, onEventTitleConfirm])

  const { isUnsavedConfirmOpen, requestClose, handleCloseUnsavedConfirm, handleLeaveUnsavedForm } =
    useUnsavedCloseGuard({
      isDirty,
      onClose,
      onDiscard: handleDiscardDraftTitle,
      registerCloseGuard,
    })
  const repeatGuardEnabled = isEditing && hasExistingRecurrence

  const buildDateTime = useCallback((dateValue: Date | null, timeValue?: string) => {
    const nextDate = dateValue ? new Date(dateValue) : new Date()
    if (!timeValue) {
      nextDate.setHours(0, 0, 0, 0)
      return nextDate
    }
    const [hour, minute] = timeValue.split(':').map((value) => Number.parseInt(value, 10))
    nextDate.setHours(Number.isNaN(hour) ? 0 : hour, Number.isNaN(minute) ? 0 : minute, 0, 0)
    return nextDate
  }, [])

  const syncEventTiming = useCallback(
    (values: TodoEditorFormValues) => {
      if (eventId == null || eventId === 0) return
      if (!onEventTimingChange) return
      const baseDate = values.todoDate ?? new Date(date)
      if (values.isAllday) {
        const start = new Date(baseDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(baseDate)
        end.setHours(23, 59, 59, 999)
        onEventTimingChange(eventId, start, end, true)
        return
      }
      const start = buildDateTime(baseDate, values.todoEndTime)
      onEventTimingChange(eventId, start, start, false)
    },
    [buildDateTime, date, eventId, onEventTimingChange],
  )

  const {
    isEditConfirmOpen,
    isApplyConfirmOpen,
    handleFormSubmit,
    handleConfirmedSubmit,
    handleCancelRepeat,
  } = useTodoSubmitFlow({
    eventId,
    isEditing,
    hasExistingRecurrence,
    repeatGuardEnabled,
    isDetailReady,
    repeatConfig: todo.repeatConfig,
    setValue,
    handleSubmit: todo.handleSubmit,
    patchOccurrenceDate: occurrenceDate,
    onSubmit: todo.onSubmit,
    onClose: () => requestClose(true),
    syncEventTiming,
    onEventTitleConfirm,
  })
  const { deleteWarningVisible, setDeleteWarningVisible } = useTodoFooter({
    repeatConfig: todo.repeatConfig,
    eventId,
    isPersistedTodo,
    isEditing,
    occurrenceDate,
    hasExistingRecurrence,
    eventColor: todo.eventColor,
    setEventColor: todo.setEventColor,
    onEventColorChange,
    registerFooterChildren,
    registerDeleteHandler,
    closeModal: () => requestClose(true),
  })

  useSyncEventTiming({
    eventId,
    fallbackDate: date,
    isAllDay: todo.isAllday,
    startDate: todo.todoDate,
    startTime: todo.todoEndTime,
    singlePointTime: true,
    buildDateTime,
    onEventTimingChange,
  })

  return (
    <>
      <form id="add-todo-form" onSubmit={handleFormSubmit}>
        <TodoEditorFields
          eventId={eventId}
          headerTitlePortalTarget={headerTitlePortalTarget}
          isEditing={isEditing}
          mode={mode}
          onEventTitleConfirm={onEventTitleConfirm}
          updateConfig={todo.updateConfig}
          handleRepeatType={todo.handleRepeatType}
        />
      </form>
      <TodoEditorConfirmModals
        deleteWarningVisible={deleteWarningVisible}
        todoTitle={todo.todoTitle}
        eventId={eventId}
        occurrenceDate={occurrenceDate}
        isEditConfirmOpen={isEditConfirmOpen}
        isApplyConfirmOpen={isApplyConfirmOpen}
        onCloseDelete={() => setDeleteWarningVisible(false)}
        onCancelEdit={handleCancelRepeat}
        onConfirmEdit={handleConfirmedSubmit}
      />
      {isUnsavedConfirmOpen && (
        <UnsavedChangesConfirmModal
          target="todo"
          isEditing={isEditing}
          onClose={handleCloseUnsavedConfirm}
          onConfirmLeave={handleLeaveUnsavedForm}
        />
      )}
    </>
  )
}

export default TodoEditorContent
