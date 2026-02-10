/** @jsxImportSource @emotion/react  */
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useFormContext } from 'react-hook-form'

import type { UseAddScheduleFormResult } from '@/shared/hooks/form/useAddScheduleForm'
import type { AddScheduleFormValues } from '@/shared/types/event/event'
import { type AddScheduleFormProps } from '@/shared/ui/modal/AddSchedule/components/AddScheduleForm.types'
import AddScheduleFormConfirmModals from '@/shared/ui/modal/AddSchedule/components/AddScheduleFormConfirmModals'
import { AddScheduleFormProvider } from '@/shared/ui/modal/AddSchedule/components/AddScheduleFormContext'
import { useAddScheduleFormContextValue } from '@/shared/ui/modal/AddSchedule/components/AddScheduleFormContext.hooks'
import AddScheduleFormFields from '@/shared/ui/modal/AddSchedule/components/AddScheduleFormFields'
import {
  useScheduleEventSync,
  useScheduleFooter,
  useScheduleFormAnchors,
  useSchedulePatchController,
  useScheduleSubmitFlow,
} from '@/shared/ui/modal/AddSchedule/hooks'
import * as S from '@/shared/ui/modal/AddSchedule/index.style'
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
  const allowCloseRef = useRef(false)

  const requestClose = useCallback(
    (force?: boolean) => {
      if (force) {
        allowCloseRef.current = true
      }
      onClose()
    },
    [onClose],
  )

  const closeGuard = useCallback(() => {
    if (allowCloseRef.current) {
      allowCloseRef.current = false
      return true
    }
    if (!isDirty) return true
    return window.confirm('저장하지 않은 변경사항이 있습니다. 닫을까요?')
  }, [isDirty])

  useEffect(() => {
    if (!registerCloseGuard) return
    registerCloseGuard(closeGuard)
    return () => registerCloseGuard()
  }, [closeGuard, registerCloseGuard])

  // 패치 요청에 필요한 포맷/빌더/함수 묶음
  const { formatDateTime, buildDateTime, patchSchedule } = useSchedulePatchController({
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
    setIsAllday(nextIsAllDay)
    if (nextIsAllDay) {
      setValue('eventStartTime', undefined, { shouldValidate: true })
      setValue('eventEndTime', undefined, { shouldValidate: true })
    }
    patchSchedule({
      ...getValues(),
      isAllday: nextIsAllDay,
      ...(nextIsAllDay ? { eventStartTime: undefined, eventEndTime: undefined } : {}),
    })
  }, [getValues, isAllday, patchSchedule, setIsAllday, setValue])

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

  // 제출/확인 플로우(반복 일정 포함)
  const {
    isEditConfirmOpen,
    isApplyConfirmOpen,
    handleFormSubmit,
    handleConfirmedSubmit,
    handleCancelRepeat,
    openApplyConfirm,
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
    getValues,
    setEventColor,
    patchSchedule,
    onEventColorChange,
    registerFooterChildren,
    registerDeleteHandler,
    openApplyConfirm,
    eventColor,
    closeModal: () => requestClose(true),
    occurrenceDate: date,
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
        eventStartDate={eventStartDate}
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
    </>
  )
}

export default AddScheduleFormContent
