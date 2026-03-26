// 할 일의 날짜와 시간을 편집하는 섹션입니다.
import { createPortal } from 'react-dom'
import { useFormContext, useWatch } from 'react-hook-form'

import { useTodoCalendarOverlay } from '@/shared/hooks/addTodo'
import type { TodoEditorFormValues } from '@/shared/types/event/event'
import type { TodoEditorFormProps } from '@/shared/types/modal/todoEditor'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import CustomDatePicker from '@/shared/ui/common/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from '@/shared/ui/common/CustomTimePicker/CustomTimePicker'
import * as S from '@/shared/ui/Modals/TodoEditor/index.style'
import { formatDisplayDate } from '@/shared/utils/date'

type TodoDateTimeSectionProps = Pick<TodoEditorFormProps, 'mode'>

const TodoDateTimeSection = ({ mode = 'modal' }: TodoDateTimeSectionProps) => {
  const { control, setValue } = useFormContext<TodoEditorFormValues>()
  const todoDate = useWatch({ control, name: 'todoDate' }) ?? null
  const todoEndTime = useWatch({ control, name: 'todoEndTime' })
  const isAllday = useWatch({ control, name: 'isAllday' }) ?? false
  const startDate = formatDisplayDate(todoDate)
  const {
    activeCalendarField,
    calendarPortalStyle,
    calendarRef,
    handleCalendarButtonClick,
    handleDateSelect,
    handleTimeChange,
    hasCalendarPortal,
  } = useTodoCalendarOverlay({
    setValue,
  })
  const shouldShowOverlay = mode !== 'inline' && activeCalendarField != null

  return (
    <>
      {shouldShowOverlay &&
        typeof document !== 'undefined' &&
        createPortal(<S.PortalDarkLayer />, document.getElementById('modal-root')!)}
      <S.Selection>
        <S.SelectionColumn>
          <S.FieldRow>
            <S.DateFieldButton type="button" onClick={handleCalendarButtonClick('start')}>
              {startDate}
            </S.DateFieldButton>
            {!isAllday && (
              <CustomTimePicker
                field="start"
                value={todoEndTime ?? ''}
                onChange={(value) => handleTimeChange('start', value)}
              />
            )}
            <S.FieldLabel>까지</S.FieldLabel>
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
                selectedDate={todoDate}
                onSelectDate={handleDateSelect}
              />
            </S.CalendarPortal>,
            document.getElementById('modal-root')!,
          )}
      </S.Selection>
      <Checkbox
        checked={isAllday}
        onChange={() =>
          setValue('isAllday', !isAllday, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        label="종일"
      />
    </>
  )
}

export default TodoDateTimeSection
