import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  useScheduleEventSync,
  useScheduleFooter,
  useSchedulePatchController,
  useScheduleSubmitFlow,
} from '@/shared/hooks/addSchedule'
import { useUnsavedCloseGuard } from '@/shared/hooks/common/useUnsavedCloseGuard'
import { useSyncEventTiming } from '@/shared/hooks/form'
import type { UseAddScheduleFormResult } from '@/shared/hooks/form/useAddScheduleForm'
import type { AddScheduleFormValues } from '@/shared/types/event/event'
import type { AddScheduleFormProps } from '@/shared/types/modal/addSchedule'
import { UnsavedChangesConfirmModal } from '@/shared/ui/modal'
import AddScheduleFormConfirmModals from '@/shared/ui/modal/AddSchedule/AddScheduleFormConfirmModals'
import AddScheduleFormFields from '@/shared/ui/modal/AddSchedule/AddScheduleFormFields'

type AddScheduleFormContentProps = AddScheduleFormProps & {
  schedule: UseAddScheduleFormResult
}

const AddScheduleFormContent = ({
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
  schedule,
}: AddScheduleFormContentProps) => {
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
  const { setValue, getValues, formState } = useFormContext<AddScheduleFormValues>()
  const { isDirty } = formState
  const { isUnsavedConfirmOpen, requestClose, handleCloseUnsavedConfirm, handleLeaveUnsavedForm } =
    useUnsavedCloseGuard({
      isDirty,
      onClose,
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
    onEventTimingChange,
    onEventTitleConfirm,
    buildDateTime,
  })

  useSyncEventTiming({
    eventId,
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
        <AddScheduleFormFields
          headerTitlePortalTarget={headerTitlePortalTarget}
          modalWrapperElement={modalWrapperElement}
          mode={mode}
          handleAllDayToggle={handleAllDayToggle}
          updateConfig={updateConfig}
          handleRepeatType={handleRepeatType}
          onTitleConfirm={handleTitleConfirm}
        />
      </form>
      <AddScheduleFormConfirmModals
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

export default AddScheduleFormContent
