import { useFormContext, useWatch } from 'react-hook-form'

import type { AddTodoFormValues, RepeatConfigSchema } from '@/shared/types/event/event'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import * as S from '@/shared/ui/modal/AddTodo/index.style'
import { CustomBasisPanel } from '@/shared/ui/modal/common/index'

type AddTodoRepeatSectionProps = {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
}

const AddTodoRepeatSection = ({ updateConfig, handleRepeatType }: AddTodoRepeatSectionProps) => {
  const { control } = useFormContext<AddTodoFormValues>()
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

export default AddTodoRepeatSection
