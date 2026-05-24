// 일정 반복 규칙과 종료 조건을 편집하는 섹션입니다.
import { useCallback, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import type { RepeatConfigSchema, ScheduleEditorFormValues } from '@/shared/types/event/event'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import CustomBasisPanel from '@/shared/ui/calendar/CustomBasisPanel/CustomBasisPanel'
import * as S from '@/shared/ui/Modals/ScheduleEditor/index.style'
import RepeatTypeGroup from '@/shared/ui/scheduleTodo/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/scheduleTodo/TerminationPanel/TerminationPanel'

type ScheduleRepeatSectionProps = {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
  readOnly?: boolean
  onReadOnlyAttempt?: () => void
  onUserEdit?: () => void
}

const ScheduleRepeatSection = ({
  updateConfig,
  handleRepeatType,
  readOnly = false,
  onReadOnlyAttempt,
  onUserEdit,
}: ScheduleRepeatSectionProps) => {
  const { control } = useFormContext<ScheduleEditorFormValues>()
  const repeatConfig = useWatch({ control, name: 'repeatConfig' }) as RepeatConfigSchema
  const eventEndDate = useWatch({ control, name: 'eventEndDate' }) ?? null
  const [isRepeatDetailOpen, setIsRepeatDetailOpen] = useState(false)
  const hasRepeatType = Boolean(repeatConfig && repeatConfig.repeatType !== 'none')
  const handleReadOnlyConfigChange = useCallback(() => {
    onReadOnlyAttempt?.()
  }, [onReadOnlyAttempt])
  const resolvedUpdateConfig = readOnly
    ? handleReadOnlyConfigChange
    : (changes: Partial<RepeatConfig>) => {
        onUserEdit?.()
        updateConfig(changes)
      }

  if (!repeatConfig) return null

  const handleToggleRepeatType = (value: RepeatType) => {
    if (readOnly) {
      onReadOnlyAttempt?.()
      return
    }
    const willClearRepeatType = repeatConfig.repeatType === value && value !== 'custom'
    const willClearCustomRepeat = repeatConfig.repeatType === 'custom' && value === 'custom'

    onUserEdit?.()
    handleRepeatType(value)
    if (willClearRepeatType || willClearCustomRepeat) {
      setIsRepeatDetailOpen(false)
      return
    }
    setIsRepeatDetailOpen(true)
  }

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
              updateConfig={resolvedUpdateConfig}
            />
          )}
          {repeatConfig.repeatType !== 'none' && (
            <TerminationPanel
              config={repeatConfig}
              updateConfig={resolvedUpdateConfig}
              minDate={eventEndDate}
            />
          )}
        </div>
      )}
    </S.Section>
  )
}

export default ScheduleRepeatSection
