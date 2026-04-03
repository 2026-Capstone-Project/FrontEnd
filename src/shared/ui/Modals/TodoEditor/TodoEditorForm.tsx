// 할 일 편집 폼 상태를 만들고 FormProvider로 하위 섹션에 전달합니다.
import { FormProvider } from 'react-hook-form'

import { useTodoEditorForm } from '@/shared/hooks/form/useTodoEditorForm'
import type { TodoEditorFormProps } from '@/shared/types/modal/todoEditor'
import TodoEditorContent from '@/shared/ui/Modals/TodoEditor/TodoEditorContent'

const TodoEditorForm = ({
  date,
  eventId,
  initialEvent,
  isEditing,
  ...rest
}: TodoEditorFormProps) => {
  const todo = useTodoEditorForm({ date, id: eventId, initialEvent, isEditing })

  return (
    <FormProvider {...todo.formMethods}>
      <TodoEditorContent
        {...rest}
        date={date}
        eventId={eventId}
        initialEvent={initialEvent}
        isEditing={isEditing}
        todo={todo}
      />
    </FormProvider>
  )
}

export default TodoEditorForm
