/** @jsxImportSource @emotion/react  */
import { useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useFormContext } from 'react-hook-form'

import {
  useScheduleEventSync,
  useScheduleFooter,
  useScheduleFormAnchors,
  useSchedulePatchController,
  useScheduleSubmitFlow,
} from '@/shared/hooks/addSchedule'
import { useUnsavedCloseGuard } from '@/shared/hooks/common/useUnsavedCloseGuard'
import { useSyncEventTiming } from '@/shared/hooks/form'
import type { UseAddScheduleFormResult } from '@/shared/hooks/form/useAddScheduleForm'
import type { AddScheduleFormValues } from '@/shared/types/event/event'
import type { AddScheduleFormProps } from '@/shared/types/modal/addSchedule'
import { UnsavedChangesConfirmModal } from '@/shared/ui/modal'
import AddScheduleFormConfirmModals from '@/shared/ui/modal/AddSchedule/form/AddScheduleFormConfirmModals'
import { useAddScheduleFormContextValue } from '@/shared/ui/modal/AddSchedule/form/AddScheduleFormContext'
import AddScheduleFormFields from '@/shared/ui/modal/AddSchedule/form/AddScheduleFormFields'
import { AddScheduleFormProvider } from '@/shared/ui/modal/AddSchedule/form/AddScheduleFormProvider'
import * as S from '@/shared/ui/modal/AddSchedule/styles/index.style'
import { formatDisplayDate } from '@/shared/utils/date'

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
  initialEvent,
  eventId,
  onEventColorChange,
  onEventTitleConfirm,
  onEventTimingChange,
  schedule,
}: AddScheduleFormContentProps) => {
  const {
    activeCalendarField,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    eventColor,
    isAllday,
    repeatConfig,
    handleCalendarOpen,
    handleDateSelect,
    handleTimeChange,
    handleSubmit,
    setIsAllday,
    setEventColor,
    isSearchPlaceOpen,
    openSearchPlace,
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

  // UI 표시용 날짜 문자열
  const startDate = formatDisplayDate(eventStartDate)
  const endDate = formatDisplayDate(eventEndDate)

  // 포털/앵커 위치 계산
  const {
    mapButtonRef,
    handleCalendarButtonClick,
    handleMapButtonClick,
    portalPosition,
    searchPortalPosition,
    searchPortalStyle,
    calendarPortalStyle,
  } = useScheduleFormAnchors({
    handleCalendarOpen,
    isSearchPlaceOpen,
    openSearchPlace,
  })
  // 종일 토글 처리 (시간 필드 초기화 포함)
  const handleAllDayToggle = useCallback(() => {
    const nextIsAllDay = !isAllday
    const isExistingRecurring = initialEvent?.recurrenceGroup != null
    setIsAllday(nextIsAllDay)
    if (nextIsAllDay) {
      setValue('eventStartTime', undefined, { shouldValidate: true })
      setValue('eventEndTime', undefined, { shouldValidate: true })
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
  }, [
    getValues,
    initialEvent?.recurrenceGroup,
    isAllday,
    isEditing,
    patchSchedule,
    setIsAllday,
    setValue,
  ])

  const isInlineMode = mode === 'inline'
  const shouldShowModalOverlay = !isInlineMode && (activeCalendarField || isSearchPlaceOpen)

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

  const contextValue = useAddScheduleFormContextValue({
    schedule,
    headerTitlePortalTarget,
    startDate,
    endDate,
    portal: {
      portalPosition,
      calendarPortalStyle,
      handleCalendarButtonClick,
      handleDateSelect,
      handleTimeChange,
      mapButtonRef,
      handleMapButtonClick,
      searchPortalPosition,
      searchPortalStyle,
    },
    handleAllDayToggle,
    onTitleConfirm: handleTitleConfirm,
  })

  return (
    <>
      {!isInlineMode &&
        shouldShowModalOverlay &&
        typeof document !== 'undefined' &&
        createPortal(<S.PortalDarkLayer />, document.getElementById('modal-root')!)}
      <AddScheduleFormProvider value={contextValue}>
        <form id="add-schedule-form" onSubmit={handleFormSubmit}>
          <AddScheduleFormFields />
        </form>
      </AddScheduleFormProvider>
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
