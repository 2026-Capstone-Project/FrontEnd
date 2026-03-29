import { useFormContext, useWatch } from 'react-hook-form'

import type { AddScheduleFormValues, RepeatConfigSchema } from '@/shared/types/event/event'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import * as S from '@/shared/ui/modal/AddSchedule/index.style'
import CustomBasisPanel from '@/shared/ui/modal/common/CustomBasisPanel/CustomBasisPanel'

type AddScheduleRepeatSectionProps = {
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
}

const AddScheduleRepeatSection = ({
  updateConfig,
  handleRepeatType,
}: AddScheduleRepeatSectionProps) => {
  const { control } = useFormContext<AddScheduleFormValues>()
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

export default AddScheduleRepeatSection
