/** @JSXImportSource @emotion/react  */
import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { FormProvider } from 'react-hook-form'

import { useAddScheduleForm } from '@/shared/hooks/useAddScheduleForm'
import { theme } from '@/shared/styles/theme'
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
import { formatDisplayDate } from '@/shared/utils/date'

type AddScheduleFormProps = {
  registerDeleteHandler?: (handler: () => void) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: number
  onClose: () => void
}

const AddScheduleForm = ({
  date,
  mode = 'modal',
  eventId,
  onClose,
  registerDeleteHandler,
  registerFooterChildren,
}: AddScheduleFormProps) => {
  console.log('편집할 이벤트 ID:', eventId)
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
  } = useAddScheduleForm({ date })
  const { register } = formMethods

  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
  const [deleteWarningVisible, setDeleteWarningVisible] = useState(false)
  const [mapAnchor, setMapAnchor] = useState<DOMRect | null>(null)
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

  const handleFormSubmit = handleSubmit((values) => {
    onSubmit(values)
    onClose()
  })

  const handleDelete = useCallback(() => {
    if (repeatConfig.repeatType !== 'none') {
      setDeleteWarningVisible(true)
    } else {
      console.log('일정 삭제 로직 처리')
    }
  }, [repeatConfig])

  useEffect(() => {
    registerDeleteHandler?.(handleDelete)
    return () => registerDeleteHandler?.(() => undefined)
  }, [handleDelete, registerDeleteHandler])

  useEffect(() => {
    registerFooterChildren?.(
      <SelectColor value={eventColor} onChange={(value) => setEventColor(value)} />,
    )
    return () => registerFooterChildren?.(null)
  }, [eventColor, registerFooterChildren, setEventColor])

  return (
    <>
      {!isInlineMode &&
        shouldShowModalOverlay &&
        typeof document !== 'undefined' &&
        createPortal(<S.PortalDarkLayer />, document.getElementById('modal-root')!)}
      <FormProvider {...formMethods}>
        <form id="add-schedule-form" onSubmit={handleFormSubmit}>
          <S.FormContent>
            <TitleSuggestionInput fieldName="eventTitle" placeholder="새로운 일정" />
            <S.Selection>
              <S.SelectionColumn>
                <S.FieldRow>
                  <S.FieldLabel>시작:</S.FieldLabel>
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
                  <S.FieldLabel>종료:</S.FieldLabel>
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
            <S.TextareaWrapper>
              <S.TextareaHeader>메모</S.TextareaHeader>
              <S.Textarea {...register('eventDescription')} />
            </S.TextareaWrapper>
            <S.FieldRow>
              <S.FieldLabel>위치</S.FieldLabel>
              <S.FieldMap type="button" onClick={handleMapButtonClick}>
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
      </FormProvider>
      {deleteWarningVisible && (
        <DeleteConfirmModal
          title={eventTitle || '새로운 이벤트'}
          onClose={() => setDeleteWarningVisible(false)}
        />
      )}
    </>
  )
}

export default AddScheduleForm
