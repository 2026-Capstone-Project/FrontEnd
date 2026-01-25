/** @jsxImportSource @emotion/react */

import { yupResolver } from '@hookform/resolvers/yup'
import { type ComponentType, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import Rotate from '@/shared/assets/icons/rotate.svg?react'
import { addScheduleSchema } from '@/shared/schemas/schedule'

import Checkbox from '../../common/Checkbox/Checkbox'
import AddModalLayout from '../../common/ModalLayout/AddModalLayout'
import * as S from './AddSchedule.style'
import {
  type DatePickerField,
  type DatePickerRenderProps,
  formatCalendarDate,
  type TimePickerField,
  type TimePickerRenderProps,
} from './AddSchedule.types'
import CustomDatePicker from './CustomDatePicker'
import CustomTimePicker from './CustomTimePicker'
import SelectColor from './SelectColor'

type RotateType = 'EVERYDAY' | 'EVERYWEEK' | 'EVERYMONTH' | 'EVERYYEAR' | 'CUSTOM' | null

type AddScheduleProps = {
  onClose: () => void
  date: string
  renderDatePicker?: ComponentType<DatePickerRenderProps>
  renderTimePicker?: ComponentType<TimePickerRenderProps>
}

const AddSchedule = ({ onClose, date, renderDatePicker, renderTimePicker }: AddScheduleProps) => {
  const [isAllday, setIsAllday] = useState(false)
  const [rotate, setRotate] = useState<RotateType>(null)
  const [activeCalendarField, setActiveCalendarField] = useState<DatePickerField | null>(null)
  const DatePickerComponent = renderDatePicker ?? CustomDatePicker
  const TimePickerComponent = renderTimePicker ?? CustomTimePicker

  const { control, register, setValue } = useForm({
    resolver: yupResolver(addScheduleSchema),
    defaultValues: {
      eventTitle: '새로운 일정',
      eventDescription: '',
      eventStartDate: new Date(date),
      eventEndDate: new Date(date),
      eventStartTime: '',
      eventEndTime: '',
      isAllday,
      rotate,
    },
  })

  const eventStartDate = useWatch({ control, name: 'eventStartDate' })
  const eventEndDate = useWatch({ control, name: 'eventEndDate' })
  const eventStartTime = useWatch({ control, name: 'eventStartTime' })
  const eventEndTime = useWatch({ control, name: 'eventEndTime' })

  useEffect(() => {
    register('eventStartDate')
    register('eventEndDate')
    register('eventStartTime')
    register('eventEndTime')
    register('isAllday')
    register('rotate')
  }, [register])

  useEffect(() => {
    setValue('isAllday', isAllday)
  }, [isAllday, setValue])

  useEffect(() => {
    setValue('rotate', rotate)
  }, [rotate, setValue])

  useEffect(() => {
    const baseDate = new Date(date)
    setValue('eventStartDate', baseDate)
    setValue('eventEndDate', baseDate)
  }, [date, setValue])

  const handleCalendarOpen = (field: DatePickerField) => {
    setActiveCalendarField(field)
  }
  const handleCalendarClose = () => setActiveCalendarField(null)

  const handleDateSelect = (selectedDate: Date) => {
    if (!activeCalendarField) return
    const fieldName = activeCalendarField === 'start' ? 'eventStartDate' : 'eventEndDate'
    setValue(fieldName, selectedDate, { shouldValidate: true })
    handleCalendarClose()
  }

  const renderCalendarArea = () => {
    if (!activeCalendarField) return null
    if (!DatePickerComponent) return null
    return (
      <DatePickerComponent
        field={activeCalendarField}
        selectedDate={
          activeCalendarField === 'start' ? (eventStartDate ?? null) : (eventEndDate ?? null)
        }
        onSelectDate={handleDateSelect}
        onClose={handleCalendarClose}
      />
    )
  }

  const handleTimeChange = (field: TimePickerField, value: string) => {
    const fieldName = field === 'start' ? 'eventStartTime' : 'eventEndTime'
    setValue(fieldName, value, { shouldValidate: true })
  }

  return (
    <AddModalLayout type="schedule" footerChildren={<SelectColor />} onClose={onClose}>
      <form css={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
        <S.DateSelection>
          <S.DateSelectionColumn>
            <S.DateFieldRow>
              <S.DateFieldLabel>시작:</S.DateFieldLabel>
              <S.DateFieldButton type="button" onClick={() => handleCalendarOpen('start')}>
                {formatCalendarDate(eventStartDate)}
              </S.DateFieldButton>
              {!isAllday && (
                <TimePickerComponent
                  field="start"
                  value={eventStartTime ?? ''}
                  onChange={(value) => handleTimeChange('start', value)}
                />
              )}
            </S.DateFieldRow>

            <S.DateFieldRow>
              <S.DateFieldLabel>종료:</S.DateFieldLabel>
              <S.DateFieldButton type="button" onClick={() => handleCalendarOpen('end')}>
                {formatCalendarDate(eventEndDate)}
              </S.DateFieldButton>
              {!isAllday && (
                <TimePickerComponent
                  field="end"
                  value={eventEndTime ?? ''}
                  onChange={(value) => handleTimeChange('end', value)}
                />
              )}
            </S.DateFieldRow>
          </S.DateSelectionColumn>
          {activeCalendarField && <S.CalendarPopover>{renderCalendarArea()}</S.CalendarPopover>}
        </S.DateSelection>
        <Checkbox checked={isAllday} onChange={() => setIsAllday((prev) => !prev)} label="종일" />
        <S.Textarea />
        <S.ButtonWrapper>
          <Rotate />
          <S.Button
            type="button"
            isActive={rotate === 'EVERYDAY'}
            onClick={() => setRotate((prev) => (prev === 'EVERYDAY' ? null : 'EVERYDAY'))}
          >
            매일
          </S.Button>
          <S.Button
            type="button"
            isActive={rotate === 'EVERYWEEK'}
            onClick={() => setRotate((prev) => (prev === 'EVERYWEEK' ? null : 'EVERYWEEK'))}
          >
            매주
          </S.Button>
          <S.Button
            type="button"
            isActive={rotate === 'EVERYMONTH'}
            onClick={() => setRotate((prev) => (prev === 'EVERYMONTH' ? null : 'EVERYMONTH'))}
          >
            매월
          </S.Button>
          <S.Button
            type="button"
            isActive={rotate === 'EVERYYEAR'}
            onClick={() => setRotate((prev) => (prev === 'EVERYYEAR' ? null : 'EVERYYEAR'))}
          >
            매년
          </S.Button>
          <S.Button
            type="button"
            isActive={rotate === 'CUSTOM'}
            onClick={() => setRotate((prev) => (prev === 'CUSTOM' ? null : 'CUSTOM'))}
          >
            사용자 지정
          </S.Button>
        </S.ButtonWrapper>
      </form>
    </AddModalLayout>
  )
}

export default AddSchedule
