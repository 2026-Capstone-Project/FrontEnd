import { useFormContext, useWatch } from 'react-hook-form'

import type { RepeatConfigSchema, TodoEditorFormValues } from '@/shared/types/event/event'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import CustomBasisPanel from '@/shared/ui/common/CustomBasisPanel/CustomBasisPanel'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import * as S from '@/shared/ui/Modals/TodoEditor/index.style'

type TodoRepeatSectionProps = {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
}

const TodoRepeatSection = ({ updateConfig, handleRepeatType }: TodoRepeatSectionProps) => {
  const { control } = useFormContext<TodoEditorFormValues>()
  const repeatConfig = useWatch({ control, name: 'repeatConfig' }) as RepeatConfigSchema
  const todoDate = useWatch({ control, name: 'todoDate' }) ?? null

  if (!repeatConfig) return null

  const repeatEndDate = todoDate ? new Date(todoDate) : null
  repeatEndDate?.setHours(0, 0, 0, 0)

  return (
    <S.Section>
      <RepeatTypeGroup
        repeatType={repeatConfig.repeatType}
        customBasis={repeatConfig.customBasis}
        onToggleType={handleRepeatType}
      />
      <div style={{ marginTop: '12px' }}>
        {repeatConfig.repeatType === 'custom' && (
          <CustomBasisPanel
            config={repeatConfig}
            customBasis={repeatConfig.customBasis}
            updateConfig={updateConfig}
          />
        )}
        {repeatConfig.repeatType !== 'none' && (
          <TerminationPanel
            config={repeatConfig}
            updateConfig={updateConfig}
            minDate={repeatEndDate}
          />
        )}
      </div>
    </S.Section>
  )
}

export default TodoRepeatSection
