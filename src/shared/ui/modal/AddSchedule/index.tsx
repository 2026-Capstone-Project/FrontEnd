/* eslint-disable react-hooks/set-state-in-effect */
/** @jsxImportSource @emotion/react */

import { type MouseEvent as ReactMouseEvent, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { FormProvider } from 'react-hook-form'

import { useAddScheduleForm } from '@/shared/hooks/useAddScheduleForm'
import { theme } from '@/shared/styles/theme'
import type { DatePickerField } from '@/shared/types/event'
import { formatDisplayDate } from '@/shared/utils/date'

import Checkbox from '../../common/Checkbox/Checkbox'
import AddModalLayout from '../AddModalLayout/AddModalLayout'
import DeleteConfirmModal from '../DeleteConfirmModal/DeleteConfirmModal'
import CustomBasisPanel from './components/CustomBasisPanel/CustomBasisPanel'
import CustomDatePicker from './components/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from './components/CustomTimePicker/CustomTimePicker'
import RepeatTypeGroup from './components/RepeatTypeGroup/RepeatTypeGroup'
import SearchPlace from './components/SearchPlace/SearchPlace'
import SelectColor from './components/SelectColor/SelectColor'
import TerminationPanel from './components/TerminationPanel/TerminationPanel'
import TitleSuggestionInput from './components/TitleSuggestionInput/TitleSuggestionInput'
import * as S from './index.style'

type AddScheduleProps = {
  onClose: () => void
  date: string
  mode?: 'modal' | 'inline'
}
//TODO: 위치 버튼 누르면 위치 선택 모달 오픈
//TODO: 제목 입력시 검색해서 최근 타이틀 추천

const AddScheduleModal = ({ onClose, date, mode = 'modal' }: AddScheduleProps) => {
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

  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
  const [deleteWarningVisible, setDeleteWarningVisible] = useState(false)
  const [mapAnchor, setMapAnchor] = useState<DOMRect | null>(null)
  const [isMobileLayout, setIsMobileLayout] = useState(false)
  const startDate = formatDisplayDate(eventStartDate)
  const endDate = formatDisplayDate(eventEndDate)

  const handleCalendarButtonClick =
    (field: DatePickerField) => (event: ReactMouseEvent<HTMLButtonElement>) => {
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
    if (!activeCalendarField) {
      setCalendarAnchor(null)
    }
  }, [activeCalendarField])

  useEffect(() => {
    if (!isSearchPlaceOpen) {
      setMapAnchor(null)
    }
  }, [isSearchPlaceOpen])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`)

    setIsMobileLayout(mediaQuery.matches)
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

  const handleDelete = () => {
    if (repeatConfig.repeatType !== 'none') {
      setDeleteWarningVisible(true)
    } else {
      console.log('일정 삭제 로직 처리')
    }
  }

  return (
    <>
      {!isInlineMode &&
        shouldShowModalOverlay &&
        typeof document !== 'undefined' &&
        createPortal(<S.PortalDarkLayer />, document.getElementById('modal-root')!)}
      <AddModalLayout
        type="schedule"
        footerChildren={
          <SelectColor value={eventColor} onChange={(value) => setEventColor(value)} />
        }
        onClose={onClose}
        embedded={isInlineMode}
        submitFormId="add-schedule-form"
        handleDelete={handleDelete}
      >
        <FormProvider {...formMethods}>
          <form id="add-schedule-form" onSubmit={handleFormSubmit}>
            <S.FormContent>
              <TitleSuggestionInput />
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
                <S.Textarea />
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
      </AddModalLayout>
      {deleteWarningVisible && (
        <DeleteConfirmModal
          title={eventTitle || '새로운 이벤트'}
          onClose={() => setDeleteWarningVisible(false)}
        />
      )}
    </>
  )
}

export default AddScheduleModal
