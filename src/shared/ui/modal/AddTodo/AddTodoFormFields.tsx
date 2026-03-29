import type { AddTodoFormProps } from '@/shared/types/modal/addTodo'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import AddTodoDateTimeSection from '@/shared/ui/modal/AddTodo/AddTodoDateTimeSection'
import AddTodoNotesSection from '@/shared/ui/modal/AddTodo/AddTodoNotesSection'
import AddTodoPrioritySection from '@/shared/ui/modal/AddTodo/AddTodoPrioritySection'
import AddTodoRepeatSection from '@/shared/ui/modal/AddTodo/AddTodoRepeatSection'
import AddTodoTitleField from '@/shared/ui/modal/AddTodo/AddTodoTitleField'
import * as S from '@/shared/ui/modal/AddTodo/index.style'

type AddTodoFormFieldsProps = Pick<
  AddTodoFormProps,
  'eventId' | 'headerTitlePortalTarget' | 'mode' | 'onEventTitleConfirm'
> & {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
}

const AddTodoFormFields = ({
  eventId,
  headerTitlePortalTarget,
  mode = 'modal',
  onEventTitleConfirm,
  updateConfig,
  handleRepeatType,
}: AddTodoFormFieldsProps) => {
  return (
    <>
      <S.FormContent>
        <AddTodoTitleField
          eventId={eventId}
          portalTarget={headerTitlePortalTarget}
          onEventTitleConfirm={onEventTitleConfirm}
        />
        <AddTodoDateTimeSection mode={mode} />
        <AddTodoPrioritySection />
        <AddTodoNotesSection />
      </S.FormContent>
      <AddTodoRepeatSection updateConfig={updateConfig} handleRepeatType={handleRepeatType} />
    </>
  )
}

export default AddTodoFormFields
