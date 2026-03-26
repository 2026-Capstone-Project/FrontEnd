import { FormProvider } from 'react-hook-form'

import { useTodoEditorForm } from '@/shared/hooks/form/useTodoEditorForm'
import type { TodoEditorFormProps } from '@/shared/types/modal/todoEditor'
import TodoEditorContent from '@/shared/ui/Modals/TodoEditor/TodoEditorContent'

const TodoEditorForm = ({ date, eventId, isEditing, ...rest }: TodoEditorFormProps) => {
  const todo = useTodoEditorForm({ date, id: eventId, isEditing })

  return (
    <FormProvider {...todo.formMethods}>
      <TodoEditorContent
        {...rest}
        date={date}
        eventId={eventId}
        isEditing={isEditing}
        todo={todo}
      />
    </FormProvider>
  )
}

export default TodoEditorForm
