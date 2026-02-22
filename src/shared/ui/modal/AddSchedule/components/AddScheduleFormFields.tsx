/** @jsxImportSource @emotion/react  */
import { createPortal } from 'react-dom'
import { useFormContext } from 'react-hook-form'

import type { AddScheduleFormValues } from '@/shared/types/event/event'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import TitleSuggestionInput from '@/shared/ui/common/TitleSuggestionInput/TitleSuggestionInput'
import {
  CustomBasisPanel,
  CustomDatePicker,
  CustomTimePicker,
  SearchPlace,
} from '@/shared/ui/modal/AddSchedule/components'
import { useAddScheduleFormContext } from '@/shared/ui/modal/AddSchedule/components/AddScheduleFormContext.hooks'
import * as S from '@/shared/ui/modal/AddSchedule/index.style'

const AddScheduleFormFields = () => {
  const { register } = useFormContext<AddScheduleFormValues>()
  const {
    headerTitlePortalTarget,
    isAllday,
    startDate,
    endDate,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
    activeCalendarField,
    calendarRef,
    portalPosition,
    calendarPortalStyle,
    handleCalendarButtonClick,
    handleDateSelect,
    handleTimeChange,
    handleAllDayToggle,
    mapButtonRef,
    handleMapButtonClick,
    isSearchPlaceOpen,
    searchPortalPosition,
    searchPortalStyle,
    mapRef,
    repeatConfig,
    updateConfig,
    handleRepeatType,
    onTitleConfirm,
  } = useAddScheduleFormContext()

  // 폼 본문 UI 렌더링
  return (
    <>
      <S.FormContent>
        {!headerTitlePortalTarget && (
          <TitleSuggestionInput
            fieldName="eventTitle"
            placeholder="새로운 일정"
            autoFocus
            onLiveChange={onTitleConfirm}
            onConfirm={onTitleConfirm}
          />
        )}
        <S.Selection>
          <S.SelectionColumn isAllday={isAllday}>
            <S.FieldRow isAllday={isAllday}>
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
            {isAllday && '-'}
            <S.FieldRow isAllday={isAllday}>
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
        <Checkbox checked={isAllday} onChange={handleAllDayToggle} label="종일" />
        <S.BottomSection>
          <S.TextareaWrapper>
            <S.TextareaHeader>메모</S.TextareaHeader>
            <S.Textarea {...register('eventDescription')} />
          </S.TextareaWrapper>
          <S.FieldRow css={{ width: '100%' }}>
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
      {headerTitlePortalTarget &&
        createPortal(
          <TitleSuggestionInput
            fieldName="eventTitle"
            placeholder="새로운 일정"
            autoFocus
            onLiveChange={onTitleConfirm}
            onConfirm={onTitleConfirm}
          />,
          headerTitlePortalTarget,
        )}
    </>
  )
}

export default AddScheduleFormFields
