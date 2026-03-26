import { useFormContext, useWatch } from 'react-hook-form'

import { PRIORITY_OPTIONS } from '@/shared/constants/todo'
import { theme } from '@/shared/styles/theme'
import type { TodoEditorFormValues } from '@/shared/types/event/event'
import * as S from '@/shared/ui/Modals/TodoEditor/index.style'
import { getPriorityColor } from '@/shared/utils/index'

const TodoPrioritySection = () => {
  const { control, setValue } = useFormContext<TodoEditorFormValues>()
  const todoPriority = useWatch({ control, name: 'todoPriority' }) ?? 'MEDIUM'

  return (
    <S.PrioritySection>
      <S.PriorityLabel>중요도</S.PriorityLabel>
      <S.PriorityOptions>
        {PRIORITY_OPTIONS.map((option) => {
          const token = getPriorityColor(option.value)
          const palette = theme.colors.priority[token]

          return (
            <S.PriorityOptionButton
              key={option.value}
              type="button"
              isActive={todoPriority === option.value}
              baseColor={palette.base}
              pointColor={palette.point}
              onClick={() =>
                setValue('todoPriority', option.value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            >
              {option.label}
            </S.PriorityOptionButton>
          )
        })}
      </S.PriorityOptions>
    </S.PrioritySection>
  )
}

export default TodoPrioritySection
