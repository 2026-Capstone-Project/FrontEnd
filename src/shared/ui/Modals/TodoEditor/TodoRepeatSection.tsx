// 할 일 반복 규칙과 종료 조건을 편집하는 섹션입니다.
import { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import type { RepeatConfigSchema, TodoEditorFormValues } from '@/shared/types/event/event'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import CustomBasisPanel from '@/shared/ui/calendar/CustomBasisPanel/CustomBasisPanel'
import * as S from '@/shared/ui/Modals/TodoEditor/index.style'
import RepeatTypeGroup from '@/shared/ui/scheduleTodo/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/scheduleTodo/TerminationPanel/TerminationPanel'

type TodoRepeatSectionProps = {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
}

const TodoRepeatSection = ({ updateConfig, handleRepeatType }: TodoRepeatSectionProps) => {
  const { control } = useFormContext<TodoEditorFormValues>()
  const repeatConfig = useWatch({ control, name: 'repeatConfig' }) as RepeatConfigSchema
  const todoDate = useWatch({ control, name: 'todoDate' }) ?? null
  const [isRepeatDetailOpen, setIsRepeatDetailOpen] = useState(false)
  const hasRepeatType = Boolean(repeatConfig && repeatConfig.repeatType !== 'none')

  if (!repeatConfig) return null

  const handleToggleRepeatType = (value: RepeatType) => {
    const willClearRepeatType = repeatConfig.repeatType === value && value !== 'custom'
    const willClearCustomRepeat = repeatConfig.repeatType === 'custom' && value === 'custom'

    handleRepeatType(value)
    if (willClearRepeatType || willClearCustomRepeat) {
      setIsRepeatDetailOpen(false)
      return
    }
    setIsRepeatDetailOpen(true)
  }

  const repeatEndDate = todoDate ? new Date(todoDate) : null
  repeatEndDate?.setHours(0, 0, 0, 0)

  return (
    <S.Section>
      <RepeatTypeGroup
        repeatType={repeatConfig.repeatType}
        customBasis={repeatConfig.customBasis}
        onToggleType={handleToggleRepeatType}
        canToggleDetail={hasRepeatType}
        isDetailOpen={isRepeatDetailOpen}
        onToggleDetail={() => {
          if (!hasRepeatType) return
          setIsRepeatDetailOpen((previous) => !previous)
        }}
      />
      {hasRepeatType && isRepeatDetailOpen && (
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
      )}
    </S.Section>
  )
}

export default TodoRepeatSection
