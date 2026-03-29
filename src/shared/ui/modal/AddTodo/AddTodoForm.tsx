import { FormProvider } from 'react-hook-form'

import { useAddTodoForm } from '@/shared/hooks/form/useAddTodoForm'
import type { AddTodoFormProps } from '@/shared/types/modal/addTodo'
import AddTodoFormContent from '@/shared/ui/modal/AddTodo/AddTodoFormContent'

const AddTodoForm = ({ date, eventId, isEditing, ...rest }: AddTodoFormProps) => {
  const todo = useAddTodoForm({ date, id: eventId, isEditing })

  return (
    <FormProvider {...todo.formMethods}>
      <AddTodoFormContent
        {...rest}
        date={date}
        eventId={eventId}
        isEditing={isEditing}
        todo={todo}
      />
    </FormProvider>
  )
}

export default AddTodoForm
