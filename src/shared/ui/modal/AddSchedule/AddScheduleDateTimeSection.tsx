import { createPortal } from 'react-dom'
import { useFormContext, useWatch } from 'react-hook-form'

import { useScheduleCalendarOverlay } from '@/shared/hooks/addSchedule'
import { useCalendarFieldPicker } from '@/shared/hooks/form/useCalendarFieldPicker'
import type { AddScheduleFormValues } from '@/shared/types/event/event'
import type { AddScheduleFormProps } from '@/shared/types/modal/addSchedule'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import * as S from '@/shared/ui/modal/AddSchedule/index.style'
import CustomDatePicker from '@/shared/ui/modal/common/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from '@/shared/ui/modal/common/CustomTimePicker/CustomTimePicker'
import { formatDisplayDate } from '@/shared/utils/date'

type AddScheduleDateTimeSectionProps = Pick<AddScheduleFormProps, 'mode'> & {
  handleAllDayToggle: () => void
}

const AddScheduleDateTimeSection = ({
  mode = 'modal',
  handleAllDayToggle,
}: AddScheduleDateTimeSectionProps) => {
  const { control, setValue } = useFormContext<AddScheduleFormValues>()
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
      <Checkbox checked={isAllday} onChange={handleAllDayToggle} label="종일" />
    </>
  )
}

export default AddScheduleDateTimeSection
