// 일정의 시작/종료 날짜와 시간을 편집하는 섹션입니다.
import { createPortal } from 'react-dom'
import { useFormContext, useWatch } from 'react-hook-form'

import { useScheduleCalendarOverlay } from '@/shared/hooks/addSchedule'
import { useCalendarFieldPicker } from '@/shared/hooks/form/useCalendarFieldPicker'
import type { ScheduleEditorFormValues } from '@/shared/types/event/event'
import type { ScheduleEditorFormProps } from '@/shared/types/modal/scheduleEditor'
import CustomDatePicker from '@/shared/ui/calendar/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from '@/shared/ui/calendar/CustomTimePicker/CustomTimePicker'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import * as S from '@/shared/ui/Modals/ScheduleEditor/index.style'
import { formatDisplayDate } from '@/shared/utils/date'

type ScheduleDateTimeSectionProps = Pick<ScheduleEditorFormProps, 'mode'> & {
  handleAllDayToggle: () => void
  readOnly?: boolean
  onReadOnlyAttempt?: () => void
}

const ScheduleDateTimeSection = ({
  mode = 'modal',
  handleAllDayToggle,
  readOnly = false,
  onReadOnlyAttempt,
}: ScheduleDateTimeSectionProps) => {
  const { control, setValue } = useFormContext<ScheduleEditorFormValues>()
  const isAllday = useWatch({ control, name: 'isAllday' }) ?? false
  const eventStartDate = useWatch({ control, name: 'eventStartDate' }) ?? null
  const eventEndDate = useWatch({ control, name: 'eventEndDate' }) ?? null
  const eventStartTime = useWatch({ control, name: 'eventStartTime' })
  const eventEndTime = useWatch({ control, name: 'eventEndTime' })
  const startDate = formatDisplayDate(eventStartDate)
  const endDate = formatDisplayDate(eventEndDate)
  const {
    activeCalendarField,
    calendarRef,
    handleCalendarOpen,
    handleDateSelect,
    handleTimeChange,
  } = useCalendarFieldPicker({
    setValue,
    eventStartDate,
    eventEndDate,
    eventStartTime,
    eventEndTime,
  })
  const { calendarPortalStyle, handleCalendarButtonClick, hasCalendarPortal } =
    useScheduleCalendarOverlay({
      handleCalendarOpen,
    })
  const shouldShowOverlay = mode !== 'inline' && activeCalendarField != null

  return (
    <>
      {shouldShowOverlay &&
        typeof document !== 'undefined' &&
        createPortal(<S.PortalDarkLayer />, document.getElementById('modal-root')!)}
      <S.Selection>
        <S.SelectionColumn isAllday={isAllday}>
          <S.FieldRow isAllday={isAllday}>
            <S.DateFieldButton
              type="button"
              onClick={readOnly ? onReadOnlyAttempt : handleCalendarButtonClick('start')}
            >
              {startDate}
            </S.DateFieldButton>
            {!isAllday && (
              <CustomTimePicker
                field="start"
                value={eventStartTime ?? ''}
                onChange={(value) => handleTimeChange('start', value)}
                readOnly={readOnly}
                onReadOnlyAttempt={onReadOnlyAttempt}
              />
            )}
          </S.FieldRow>
          {isAllday && '-'}
          <S.FieldRow isAllday={isAllday}>
            <S.DateFieldButton
              type="button"
              onClick={readOnly ? onReadOnlyAttempt : handleCalendarButtonClick('end')}
            >
              {endDate}
            </S.DateFieldButton>
            {!isAllday && (
              <CustomTimePicker
                field="end"
                value={eventEndTime ?? ''}
                onChange={(value) => handleTimeChange('end', value)}
                readOnly={readOnly}
                onReadOnlyAttempt={onReadOnlyAttempt}
              />
            )}
          </S.FieldRow>
        </S.SelectionColumn>
        {activeCalendarField &&
          hasCalendarPortal &&
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
        onChange={handleAllDayToggle}
        label="종일"
        readOnly={readOnly}
        onReadOnlyAttempt={onReadOnlyAttempt}
      />
    </>
  )
}

export default ScheduleDateTimeSection
