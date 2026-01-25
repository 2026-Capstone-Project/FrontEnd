/** @jsxImportSource @emotion/react */

import { type MouseEvent, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import type { DatePickerField } from '@/shared/types/event'
import { formatDisplayDate } from '@/shared/utils/date'

import { useAddScheduleForm } from '../../../hooks/useAddScheduleForm'
import Checkbox from '../../common/Checkbox/Checkbox'
import AddModalLayout from '../ScheduleModal/AddModalLayout'
import CustomBasisPanel from './components/CustomBasisPanel/CustomBasisPanel'
import CustomDatePicker from './components/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from './components/CustomTimePicker/CustomTimePicker'
import RepeatTypeGroup from './components/RepeatTypeGroup/RepeatTypeGroup'
import SelectColor from './components/SelectColor/SelectColor'
import TerminationPanel from './components/TerminationPanel/TerminationPanel'
import * as S from './index.style'

type AddScheduleProps = {
  onClose: () => void
  date: string
}
//TODO: textarea에 메모 라벨 추가
//TODO: textarea에 위치 버튼 추가
//TODO: 위치 버튼 누르면 위치 선택 모달 오픈
//TODO: 제목 입력시 검색해서 최근 타이틀 추천

const AddScheduleModal = ({ onClose, date }: AddScheduleProps) => {
  const {
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
    register,
    setIsAllday,
    setEventColor,
    updateConfig,
    handleRepeatType,
  } = useAddScheduleForm({ date })
  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)

  const handleCalendarButtonClick =
    (field: DatePickerField) => (event: MouseEvent<HTMLButtonElement>) => {
      handleCalendarOpen(field)
      const target = event.currentTarget
      setCalendarAnchor(target.getBoundingClientRect())
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

  useEffect(() => {
    if (!activeCalendarField) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCalendarAnchor(null)
    }
  }, [activeCalendarField])

  return (
    <AddModalLayout
      type="schedule"
      footerChildren={<SelectColor value={eventColor} onChange={(value) => setEventColor(value)} />}
      onClose={onClose}
      submitFormId="add-schedule-form"
    >
      <form id="add-schedule-form" onSubmit={handleSubmit(onSubmit)}>
        <S.FormContent>
          <S.TitleInput
            type="text"
            {...register('eventTitle')}
            placeholder="일정 제목을 입력하세요"
          />
          <S.DateSelection>
            <S.DateSelectionColumn>
              <S.DateFieldRow>
                <S.DateFieldLabel>시작:</S.DateFieldLabel>
                <S.DateFieldButton type="button" onClick={handleCalendarButtonClick('start')}>
                  {formatDisplayDate(eventStartDate)}
                </S.DateFieldButton>
                {!isAllday && (
                  <CustomTimePicker
                    field="start"
                    value={eventStartTime ?? ''}
                    onChange={(value) => handleTimeChange('start', value)}
                  />
                )}
              </S.DateFieldRow>
              <S.DateFieldRow>
                <S.DateFieldLabel>종료:</S.DateFieldLabel>
                <S.DateFieldButton type="button" onClick={handleCalendarButtonClick('end')}>
                  {formatDisplayDate(eventEndDate)}
                </S.DateFieldButton>
                {!isAllday && (
                  <CustomTimePicker
                    field="end"
                    value={eventEndTime ?? ''}
                    onChange={(value) => handleTimeChange('end', value)}
                  />
                )}
              </S.DateFieldRow>
            </S.DateSelectionColumn>
            {activeCalendarField &&
              portalPosition &&
              typeof document !== 'undefined' &&
              createPortal(
                <S.CalendarPortal
                  ref={calendarRef}
                  style={{
                    top: portalPosition.top,
                    left: portalPosition.left,
                  }}
                >
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
                document.body,
              )}
          </S.DateSelection>
          <Checkbox checked={isAllday} onChange={() => setIsAllday((prev) => !prev)} label="종일" />
          <S.Textarea />
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
    </AddModalLayout>
  )
}

export default AddScheduleModal
