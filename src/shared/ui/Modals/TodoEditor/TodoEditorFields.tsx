// 할 일 편집 화면의 제목, 날짜, 중요도, 메모, 반복 섹션을 배치합니다.
import type { TodoEditorFormProps } from '@/shared/types/modal/todoEditor'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import * as S from '@/shared/ui/Modals/TodoEditor/index.style'
import TodoDateTimeSection from '@/shared/ui/Modals/TodoEditor/TodoDateTimeSection'
import TodoNotesSection from '@/shared/ui/Modals/TodoEditor/TodoNotesSection'
import TodoPrioritySection from '@/shared/ui/Modals/TodoEditor/TodoPrioritySection'
import TodoRepeatSection from '@/shared/ui/Modals/TodoEditor/TodoRepeatSection'
import TodoTitleField from '@/shared/ui/Modals/TodoEditor/TodoTitleField'

type TodoEditorFieldsProps = Pick<
  TodoEditorFormProps,
  'eventId' | 'headerTitlePortalTarget' | 'isEditing' | 'mode' | 'onEventTitleConfirm'
> & {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
}

const TodoEditorFields = ({
  eventId,
  headerTitlePortalTarget,
  isEditing = false,
  mode = 'modal',
  onEventTitleConfirm,
  updateConfig,
  handleRepeatType,
}: TodoEditorFieldsProps) => {
  return (
    <>
      <S.FormContent>
        <TodoTitleField
          eventId={eventId}
          portalTarget={headerTitlePortalTarget}
          autoFocus={!isEditing}
          onEventTitleConfirm={onEventTitleConfirm}
        />
        <TodoDateTimeSection mode={mode} />
        <TodoPrioritySection />
        <TodoNotesSection />
      </S.FormContent>
      <TodoRepeatSection updateConfig={updateConfig} handleRepeatType={handleRepeatType} />
    </>
  )
}

export default TodoEditorFields
