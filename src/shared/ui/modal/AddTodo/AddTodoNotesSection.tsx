import { useFormContext } from 'react-hook-form'

import type { AddTodoFormValues } from '@/shared/types/event/event'
import * as S from '@/shared/ui/modal/AddTodo/index.style'

const AddTodoNotesSection = () => {
  const { register } = useFormContext<AddTodoFormValues>()

  return (
    <S.TextareaWrapper>
      <S.TextareaHeader>메모</S.TextareaHeader>
      <S.Textarea {...register('todoDescription')} />
    </S.TextareaWrapper>
  )
}

export default AddTodoNotesSection
