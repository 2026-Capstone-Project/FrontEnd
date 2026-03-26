import { useFormContext, useWatch } from 'react-hook-form'

import type { RepeatConfigSchema, ScheduleEditorFormValues } from '@/shared/types/event/event'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import CustomBasisPanel from '@/shared/ui/common/CustomBasisPanel/CustomBasisPanel'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import * as S from '@/shared/ui/Modals/ScheduleEditor/index.style'

type ScheduleRepeatSectionProps = {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
}

const ScheduleRepeatSection = ({ updateConfig, handleRepeatType }: ScheduleRepeatSectionProps) => {
  const { control } = useFormContext<ScheduleEditorFormValues>()
  const repeatConfig = useWatch({ control, name: 'repeatConfig' }) as RepeatConfigSchema
  const eventEndDate = useWatch({ control, name: 'eventEndDate' }) ?? null

  if (!repeatConfig) return null

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
            minDate={eventEndDate}
          />
        )}
      </div>
    </S.Section>
  )
}

export default ScheduleRepeatSection
