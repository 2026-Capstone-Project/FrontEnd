// 일정 편집 본문을 조합하고 제출, 패치, 삭제, 닫기 보호 흐름을 연결합니다.
import { useCallback, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  useScheduleEventSync,
  useScheduleFooter,
  useSchedulePatchController,
  useScheduleSubmitFlow,
} from '@/shared/hooks/addSchedule'
import { useUnsavedCloseGuard } from '@/shared/hooks/common/useUnsavedCloseGuard'
import { useSyncEventTiming } from '@/shared/hooks/form'
import type { UseScheduleEditorFormResult } from '@/shared/hooks/form/useScheduleEditorForm'
import type { ScheduleEditorFormValues } from '@/shared/types/event/event'
import type { ScheduleEditorFormProps } from '@/shared/types/modal/scheduleEditor'
import { UnsavedChangesConfirmModal } from '@/shared/ui/Modals'
import ScheduleEditorConfirmModals from '@/shared/ui/Modals/ScheduleEditor/ScheduleEditorConfirmModals'
import ScheduleEditorFields from '@/shared/ui/Modals/ScheduleEditor/ScheduleEditorFields'

type ScheduleEditorContentProps = ScheduleEditorFormProps & {
  schedule: UseScheduleEditorFormResult
}

const ScheduleEditorContent = ({
  date,
  mode = 'modal',
  onClose,
  registerDeleteHandler,
  registerCloseGuard,
  registerFooterChildren,
  isEditing = false,
  headerTitlePortalTarget,
  modalWrapperElement,
  initialEvent,
  eventId,
  onEventColorChange,
  onEventTitleConfirm,
  onEventTimingChange,
  onSharedChange,
  schedule,
}: ScheduleEditorContentProps) => {
  const {
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    eventColor,
    isAllday,
    repeatConfig,
    handleRepeatType,
    handleSubmit,
    updateConfig,
    setEventColor,
    eventTitle,
  } = schedule
  const { setValue, getValues, formState } = useFormContext<ScheduleEditorFormValues>()
  const { isDirty } = formState
  const originalTitleRef = useRef('')

  useEffect(() => {
    if (!isEditing) {
      originalTitleRef.current = ''
      return
    }
    originalTitleRef.current = initialEvent?.title ?? ''
  }, [eventId, initialEvent?.occurrenceDate, initialEvent?.start, isEditing])

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

  // 패치 요청에 필요한 포맷/빌더/함수 묶음
  const { formatDateTime, buildDateTime, patchSchedule, createSchedule } =
    useSchedulePatchController({
      eventId,
      date,
      initialEvent,
    })

  // 종일 토글 처리 (시간 필드 초기화 포함)
  const handleAllDayToggle = useCallback(() => {
    const nextIsAllDay = !isAllday
    const isExistingRecurring = initialEvent?.recurrenceGroup != null
    setValue('isAllday', nextIsAllDay, {
      shouldDirty: true,
      shouldValidate: true,
    })
    if (nextIsAllDay) {
      setValue('eventStartTime', undefined, { shouldDirty: true, shouldValidate: true })
      setValue('eventEndTime', undefined, { shouldDirty: true, shouldValidate: true })
    }
    if (isEditing) {
      void patchSchedule(
        {
          ...getValues(),
          isAllday: nextIsAllDay,
          ...(nextIsAllDay ? { eventStartTime: undefined, eventEndTime: undefined } : {}),
        },
        isExistingRecurring ? 'THIS_EVENT' : undefined,
      )
    }
  }, [getValues, initialEvent?.recurrenceGroup, isAllday, isEditing, patchSchedule, setValue])

  // 로컬 이벤트 동기화(타이틀/시간)
  const { syncEventTiming, handleTitleConfirm } = useScheduleEventSync({
    eventId,
    date,
    occurrenceDate: initialEvent?.occurrenceDate,
    onEventTimingChange,
    onEventTitleConfirm,
    buildDateTime,
  })

  useSyncEventTiming({
    eventId,
    occurrenceDate: initialEvent?.occurrenceDate,
    fallbackDate: date,
    isAllDay: isAllday,
    startDate: eventStartDate,
    endDate: eventEndDate,
    startTime: eventStartTime,
    endTime: eventEndTime,
    buildDateTime,
    onEventTimingChange,
  })

  // 제출/확인 플로우(반복 일정 포함)
  const {
    isEditConfirmOpen,
    isApplyConfirmOpen,
    handleFormSubmit,
    handleConfirmedSubmit,
    handleCancelRepeat,
  } = useScheduleSubmitFlow({
    date,
    eventId,
    initialEvent,
    isEditing,
    handleSubmit,
    onClose: () => requestClose(true),
    repeatConfig,
    setValue,
    patchSchedule,
    createSchedule,
    syncEventTiming,
    handleTitleConfirm,
    buildDateTime,
    formatDateTime,
  })

  // 하단 컬러 선택/삭제 핸들러
  const { deleteWarningVisible, setDeleteWarningVisible } = useScheduleFooter({
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
    closeModal: () => requestClose(true),
    occurrenceDate: initialEvent?.occurrenceDate ?? date,
  })

  return (
    <>
      <form id="add-schedule-form" onSubmit={handleFormSubmit}>
        <ScheduleEditorFields
          headerTitlePortalTarget={headerTitlePortalTarget}
          isEditing={isEditing}
          modalWrapperElement={modalWrapperElement}
          mode={mode}
          handleAllDayToggle={handleAllDayToggle}
          updateConfig={updateConfig}
          handleRepeatType={handleRepeatType}
          onTitleConfirm={handleTitleConfirm}
          onSharedChange={onSharedChange}
        />
      </form>
      <ScheduleEditorConfirmModals
        deleteWarningVisible={deleteWarningVisible}
        eventTitle={eventTitle}
        occurrenceDate={initialEvent?.occurrenceDate ?? date}
        eventId={eventId}
        isEditConfirmOpen={isEditConfirmOpen}
        isApplyConfirmOpen={isApplyConfirmOpen}
        onCloseDelete={() => {
          setDeleteWarningVisible(false)
          requestClose(true)
        }}
        onCancelEdit={handleCancelRepeat}
        onConfirmEdit={handleConfirmedSubmit}
      />
      {isUnsavedConfirmOpen && (
        <UnsavedChangesConfirmModal
          target="schedule"
          isEditing={isEditing}
          onClose={handleCloseUnsavedConfirm}
          onConfirmLeave={handleLeaveUnsavedForm}
        />
      )}
    </>
  )
}

export default ScheduleEditorContent
