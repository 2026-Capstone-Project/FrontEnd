/** @jsxImportSource @emotion/react */

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
                <S.DateFieldButton type="button" onClick={() => handleCalendarOpen('start')}>
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
                <S.DateFieldButton type="button" onClick={() => handleCalendarOpen('end')}>
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
            {activeCalendarField && (
              <S.CalendarPopover ref={calendarRef}>
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
              </S.CalendarPopover>
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
