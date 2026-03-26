import { useFormContext } from 'react-hook-form'

import type { TodoEditorFormValues } from '@/shared/types/event/event'
import * as S from '@/shared/ui/Modals/TodoEditor/index.style'

const TodoNotesSection = () => {
  const { register } = useFormContext<TodoEditorFormValues>()

  return (
    <S.TextareaWrapper>
      <S.TextareaHeader>메모</S.TextareaHeader>
      <S.Textarea {...register('todoDescription')} />
    </S.TextareaWrapper>
  )
}

export default TodoNotesSection
