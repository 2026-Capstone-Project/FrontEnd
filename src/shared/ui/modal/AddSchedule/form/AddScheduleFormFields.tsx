/** @jsxImportSource @emotion/react  */
import { createPortal } from 'react-dom'
import { useFormContext } from 'react-hook-form'

import { useThrottledValue } from '@/shared/hooks/common/useThrottledValue'
import { useEventTitleHistoryQuery } from '@/shared/hooks/query/useCalendarQueries'
import type { AddScheduleFormValues } from '@/shared/types/event/event'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import TitleSuggestionInput from '@/shared/ui/common/TitleSuggestionInput/TitleSuggestionInput'
import { useAddScheduleFormContext } from '@/shared/ui/modal/AddSchedule/form/AddScheduleFormContext'
import * as S from '@/shared/ui/modal/AddSchedule/styles/index.style'
import CustomBasisPanel from '@/shared/ui/modal/common/CustomBasisPanel/CustomBasisPanel'
import CustomDatePicker from '@/shared/ui/modal/common/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from '@/shared/ui/modal/common/CustomTimePicker/CustomTimePicker'
import SearchPlace from '@/shared/ui/modal/common/SearchPlace/SearchPlace'

const AddScheduleFormFields = () => {
  const { register, setValue, watch } = useFormContext<AddScheduleFormValues>()
  const {
    headerTitlePortalTarget,
    searchPlacePortalTarget,
    searchPlacePortalPlacement,
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
    closeSearchPlace,
    isSearchPlaceOpen,
    mapRef,
    repeatConfig,
    updateConfig,
    handleRepeatType,
    onTitleConfirm,
  } = useAddScheduleFormContext()
  const location = watch('location') ?? ''
  const eventTitleKeyword = (watch('eventTitle') ?? '').trim()
  const throttledEventTitleKeyword = useThrottledValue(eventTitleKeyword, 150)
  const { data: eventTitleHistoryData } = useEventTitleHistoryQuery(
    throttledEventTitleKeyword,
    Boolean(throttledEventTitleKeyword),
  )
  const eventTitleSuggestions = eventTitleHistoryData?.result.titleHistory ?? []

  // 폼 본문 UI 렌더링
  return (
    <>
      <S.FormContent>
        {!headerTitlePortalTarget && (
          <TitleSuggestionInput
            fieldName="eventTitle"
            placeholder="새로운 일정"
            autoFocus
            suggestions={eventTitleSuggestions}
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
            <S.FieldMap
              ref={mapButtonRef}
              type="button"
              onClick={handleMapButtonClick}
              $hasValue={Boolean(location)}
              title={location || '장소 추가'}
            >
              {location || '장소 추가'}
            </S.FieldMap>
            {isSearchPlaceOpen &&
              searchPlacePortalTarget &&
              createPortal(
                <S.SearchPlacePortal ref={mapRef} $placement={searchPlacePortalPlacement}>
                  <SearchPlace
                    selectedLocation={location}
                    onSelectLocation={(nextLocation, options) => {
                      setValue('location', nextLocation, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                      setValue('address', options?.address ?? null, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                      if (options?.closeAfterSelect !== false) {
                        closeSearchPlace()
                      }
                    }}
                  />
                </S.SearchPlacePortal>,
                searchPlacePortalTarget,
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
            suggestions={eventTitleSuggestions}
            onLiveChange={onTitleConfirm}
            onConfirm={onTitleConfirm}
          />,
          headerTitlePortalTarget,
        )}
    </>
  )
}

export default AddScheduleFormFields
