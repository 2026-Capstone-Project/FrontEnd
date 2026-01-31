/** @jsxImportSource @emotion/react  */
import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { FormProvider } from 'react-hook-form'

import type { CalendarEvent } from '@/features/Calendar/domain/types'
import { useAddScheduleForm } from '@/shared/hooks/useAddScheduleForm'
import { useRepeatChangeGuard } from '@/shared/hooks/useRepeatChangeGuard'
import { theme } from '@/shared/styles/theme'
import { type AddScheduleFormValues, type EventColorType } from '@/shared/types/event'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import TitleSuggestionInput from '@/shared/ui/common/TitleSuggestionInput/TitleSuggestionInput'
import CustomBasisPanel from '@/shared/ui/modal/AddSchedule/components/CustomBasisPanel/CustomBasisPanel'
import CustomDatePicker from '@/shared/ui/modal/AddSchedule/components/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from '@/shared/ui/modal/AddSchedule/components/CustomTimePicker/CustomTimePicker'
import SearchPlace from '@/shared/ui/modal/AddSchedule/components/SearchPlace/SearchPlace'
import SelectColor from '@/shared/ui/modal/AddSchedule/components/SelectColor/SelectColor'
import * as S from '@/shared/ui/modal/AddSchedule/index.style'
import DeleteConfirmModal from '@/shared/ui/modal/DeleteConfirmModal/DeleteConfirmModal'
import EditConfirmModal, {
  type EditConfirmOption,
} from '@/shared/ui/modal/EditConfirmModal/EditConfirmModal'
import { formatDisplayDate } from '@/shared/utils/date'

type AddScheduleFormProps = {
  registerDeleteHandler?: (handler?: () => void) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: CalendarEvent['id']
  onClose: () => void
  isEditing?: boolean
  headerTitlePortalTarget?: HTMLElement | null
  initialEvent?: CalendarEvent | null
  onEventColorChange?: (eventId: CalendarEvent['id'], color: EventColorType) => void
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: string) => void
  onEventTimingChange?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
  ) => void
}

const AddScheduleForm = ({
  date,
  mode = 'modal',
  onClose,
  registerDeleteHandler,
  registerFooterChildren,
  isEditing = false,
  headerTitlePortalTarget,
  initialEvent,
  eventId,
  onEventColorChange,
  onEventTitleConfirm,
  onEventTimingChange,
}: AddScheduleFormProps) => {
  const {
    formMethods,
    activeCalendarField,
    calendarRef,
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
    onSubmit,
    setIsAllday,
    setEventColor,
    updateConfig,
    handleRepeatType,
    mapRef,
    isSearchPlaceOpen,
    openSearchPlace,
    eventTitle,
  } = useAddScheduleForm({ date, initialEvent })
  const { register, setValue } = formMethods

  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
  const [deleteWarningVisible, setDeleteWarningVisible] = useState(false)
  const [mapAnchor, setMapAnchor] = useState<DOMRect | null>(null)
  const mapButtonRef = useRef<HTMLButtonElement | null>(null)
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`).matches
  })
  const startDate = formatDisplayDate(eventStartDate)
  const endDate = formatDisplayDate(eventEndDate)

  const handleCalendarButtonClick =
    (field: 'start' | 'end') => (event: ReactMouseEvent<HTMLButtonElement>) => {
      handleCalendarOpen(field)
      const target = event.currentTarget
      setCalendarAnchor(target.getBoundingClientRect())
    }

  const handleMapButtonClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    openSearchPlace()
    const target = event.currentTarget
    setMapAnchor(target.getBoundingClientRect())
  }

  useEffect(() => {
    if (!isSearchPlaceOpen) return undefined
    const updateAnchor = () => {
      const target = mapButtonRef.current
      if (!target) return
      setMapAnchor(target.getBoundingClientRect())
    }
    updateAnchor()
    window.addEventListener('scroll', updateAnchor, true)
    window.addEventListener('resize', updateAnchor)
    return () => {
      window.removeEventListener('scroll', updateAnchor, true)
      window.removeEventListener('resize', updateAnchor)
    }
  }, [isSearchPlaceOpen])

  const portalPosition = useMemo(() => {
    if (!calendarAnchor) return null
    if (typeof window === 'undefined') return null
    const scrollY = window.scrollY || 0
    const scrollX = window.scrollX || 0
    return {
      top: calendarAnchor.bottom + scrollY + 8,
      left: calendarAnchor.left + scrollX,
    }
  }, [calendarAnchor])

  const searchPortalPosition = useMemo(() => {
    if (!mapAnchor) return null
    if (typeof window === 'undefined') return null
    const scrollY = window.scrollY || 0
    const scrollX = window.scrollX || 0
    return {
      top: mapAnchor.bottom + scrollY + 8,
      left: mapAnchor.left + scrollX,
    }
  }, [mapAnchor])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`)

    const handler = (event: MediaQueryListEvent) => {
      setIsMobileLayout(event.matches)
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const searchPortalStyle = useMemo(() => {
    if (!searchPortalPosition || isMobileLayout) return undefined
    return {
      top: searchPortalPosition.top,
      left: searchPortalPosition.left,
    }
  }, [searchPortalPosition, isMobileLayout])

  const calendarPortalStyle = useMemo(() => {
    if (!portalPosition || isMobileLayout) return undefined
    return {
      top: portalPosition.top,
      left: portalPosition.left,
    }
  }, [portalPosition, isMobileLayout])

  const isInlineMode = mode === 'inline'
  const shouldShowModalOverlay = !isInlineMode && (activeCalendarField || isSearchPlaceOpen)

  // 반복 변경 시 편집 확인 모달이 뜨도록 guard 훅을 재사용합니다.
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
    (values: AddScheduleFormValues) => {
      if (eventId == null || eventId === 0) return
      if (!onEventTimingChange) return
      const startDate = values.eventStartDate ?? new Date(date)
      const endDate = values.eventEndDate ?? startDate
      if (values.isAllday) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        onEventTimingChange(eventId, start, end, true)
        return
      }
      const start = buildDateTime(startDate, values.eventStartTime)
      const end = buildDateTime(endDate, values.eventEndTime)
      onEventTimingChange(eventId, start, end, false)
    },
    [buildDateTime, date, eventId, onEventTimingChange],
  )

  const handleFormSubmit = handleSubmit((values) => {
    if (requestConfirmation()) {
      setPendingScheduleValues(values)
      return
    }
    if (eventId != null && eventId !== 0) {
      const nextTitle = values.eventTitle ?? ''
      if (nextTitle) {
        onEventTitleConfirm?.(eventId, nextTitle)
      }
    }
    syncEventTiming(values)
    onSubmit(values)
    onClose()
  })

  const handleConfirmedSubmit = useCallback(
    (option: EditConfirmOption) => {
      void option
      if (!pendingScheduleValues) return
      confirmChange()
      if (eventId != null && eventId !== 0) {
        const nextTitle = pendingScheduleValues.eventTitle ?? ''
        if (nextTitle) {
          onEventTitleConfirm?.(eventId, nextTitle)
        }
      }
      syncEventTiming(pendingScheduleValues)
      onSubmit(pendingScheduleValues)
      onClose()
      setPendingScheduleValues(null)
    },
    [
      confirmChange,
      eventId,
      onClose,
      onEventTitleConfirm,
      onSubmit,
      pendingScheduleValues,
      syncEventTiming,
    ],
  )

  const handleCancelRepeat = useCallback(() => {
    revertChange()
    setPendingScheduleValues(null)
  }, [revertChange])

  const handleDelete = useCallback(() => {
    if (repeatConfig.repeatType !== 'none') {
      setDeleteWarningVisible(true)
    } else {
      console.log('일정 삭제 로직 처리')
    }
  }, [repeatConfig])

  useEffect(() => {
    registerDeleteHandler?.(handleDelete)
    return () => registerDeleteHandler?.()
  }, [handleDelete, registerDeleteHandler])

  const handleColorChange = useCallback(
    (value: EventColorType) => {
      setEventColor(value)
      if (eventId != null && eventId !== 0) {
        onEventColorChange?.(eventId, value)
      }
    },
    [eventId, onEventColorChange, setEventColor],
  )

  const handleTitleConfirm = useCallback(
    (value: string) => {
      if (eventId != null && eventId !== 0) {
        onEventTitleConfirm?.(eventId, value)
      }
    },
    [eventId, onEventTitleConfirm],
  )

  useEffect(() => {
    registerFooterChildren?.(<SelectColor value={eventColor} onChange={handleColorChange} />)
    return () => registerFooterChildren?.(null)
  }, [eventColor, registerFooterChildren, handleColorChange])

  return (
    <>
      {!isInlineMode &&
        shouldShowModalOverlay &&
        typeof document !== 'undefined' &&
        createPortal(<S.PortalDarkLayer />, document.getElementById('modal-root')!)}
      <FormProvider {...formMethods}>
        <form id="add-schedule-form" onSubmit={handleFormSubmit}>
          <S.FormContent>
            {!headerTitlePortalTarget && (
              <TitleSuggestionInput
                fieldName="eventTitle"
                placeholder="새로운 일정"
                autoFocus
                formController={formMethods}
                onConfirm={handleTitleConfirm}
              />
            )}
            <S.Selection>
              <S.SelectionColumn>
                <S.FieldRow>
                  <S.DateFieldButton type="button" onClick={handleCalendarButtonClick('start')}>
                    {startDate}
                  </S.DateFieldButton>
                  {!isAllday && (
                    <CustomTimePicker
                      field="start"
                      value={eventStartTime ?? ''}
                      onChange={(value) => handleTimeChange('start', value)}
                    />
                  )}
                </S.FieldRow>
                <S.FieldRow>
                  <S.DateFieldButton type="button" onClick={handleCalendarButtonClick('end')}>
                    {endDate}
                  </S.DateFieldButton>
                  {!isAllday && (
                    <CustomTimePicker
                      field="end"
                      value={eventEndTime ?? ''}
                      onChange={(value) => handleTimeChange('end', value)}
                    />
                  )}
                </S.FieldRow>
              </S.SelectionColumn>
              {activeCalendarField &&
                portalPosition &&
                typeof document !== 'undefined' &&
                createPortal(
                  <S.CalendarPortal ref={calendarRef} style={calendarPortalStyle}>
                    <CustomDatePicker
                      key={activeCalendarField}
                      field={activeCalendarField}
                      selectedDate={
                        activeCalendarField === 'start'
                          ? (eventStartDate ?? null)
                          : (eventEndDate ?? null)
                      }
                      onSelectDate={handleDateSelect}
                    />
                  </S.CalendarPortal>,
                  document.getElementById('modal-root')!,
                )}
            </S.Selection>
            <Checkbox
              checked={isAllday}
              onChange={() => setIsAllday((prev) => !prev)}
              label="종일"
            />
            <S.BottomSection>
              <S.TextareaWrapper>
                <S.TextareaHeader>메모</S.TextareaHeader>
                <S.Textarea {...register('eventDescription')} />
              </S.TextareaWrapper>
              <S.FieldRow>
                <S.FieldMap ref={mapButtonRef} type="button" onClick={handleMapButtonClick}>
                  장소 추가
                </S.FieldMap>
                {isSearchPlaceOpen &&
                  searchPortalPosition &&
                  createPortal(
                    <S.SearchPlacePortal ref={mapRef} style={searchPortalStyle}>
                      <SearchPlace />
                    </S.SearchPlacePortal>,
                    document.getElementById('modal-root')!,
                  )}
              </S.FieldRow>
            </S.BottomSection>
            <RepeatTypeGroup
              repeatType={repeatConfig.repeatType}
              customBasis={repeatConfig.customBasis}
              onToggleType={handleRepeatType}
            />
          </S.FormContent>
          <div css={{ marginTop: '12px' }}>
            {repeatConfig.repeatType === 'custom' && (
              <CustomBasisPanel
                config={repeatConfig}
                customBasis={repeatConfig.customBasis}
                updateConfig={updateConfig}
              />
            )}
            {repeatConfig.repeatType !== 'none' && (
              <TerminationPanel
                config={repeatConfig}
                updateConfig={updateConfig}
                minDate={eventEndDate ?? null}
              />
            )}
          </div>
        </form>
        {headerTitlePortalTarget &&
          createPortal(
            <TitleSuggestionInput
              fieldName="eventTitle"
              placeholder="새로운 일정"
              autoFocus
              formController={formMethods}
              onConfirm={handleTitleConfirm}
            />,
            headerTitlePortalTarget,
          )}
      </FormProvider>
      {deleteWarningVisible && (
        <DeleteConfirmModal
          title={eventTitle || '새로운 이벤트'}
          onClose={() => setDeleteWarningVisible(false)}
        />
      )}
      {isEditConfirmOpen && (
        <EditConfirmModal
          title={eventTitle || '일정'}
          onCancel={handleCancelRepeat}
          onConfirm={handleConfirmedSubmit}
        />
      )}
    </>
  )
}

export default AddScheduleForm
